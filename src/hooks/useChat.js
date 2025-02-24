import { useState, useRef } from 'react';
import axios from 'axios';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const abortControllerRef = useRef(null);

  const handleInputChange = (e) => {
    if (isAiResponding) return;
    setInput(e.target.value);
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsAiResponding(false);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isAiResponding) return;

    const userMessage = { id: Date.now(), role: 'user', content: input.trim() };
    
    setInput('');
    setMessages(prev => [...prev, userMessage]);
    
    const assistantMessageId = Date.now() + 1;
    setMessages(prev => [...prev, { 
      id: assistantMessageId, 
      role: 'assistant', 
      content: '' 
    }]);

    setIsLoading(true);
    setIsAiResponding(true);
    setError(null);

    let isThinking = false;
    let thinkingContent = '';

    try {
      abortControllerRef.current = new AbortController();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              setMessages(prev => {
                return prev.map(msg => {
                  if (msg.id === assistantMessageId) {
                    let newContent = msg.content + data.content;
                    
                    // Handle think blocks
                    if (data.content.includes('<think>')) {
                      isThinking = true;
                      thinkingContent = '';
                    }
                    if (isThinking) {
                      thinkingContent += data.content;
                      if (data.content.includes('</think>')) {
                        isThinking = false;
                        newContent = thinkingContent;
                      }
                    }

                    return {
                      ...msg,
                      content: newContent
                    };
                  }
                  return msg;
                });
              });
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Don't show error for manual cancellation
      }
      console.error('API request failed:', err);
      setError(err);
      setMessages(prev => prev.map(msg => {
        if (msg.id === assistantMessageId) {
          return {
            ...msg,
            content: 'Sorry, I encountered an error. Please try again.',
            error: true
          };
        }
        return msg;
      }));
    } finally {
      setIsLoading(false);
      setIsAiResponding(false);
      abortControllerRef.current = null;
    }
  };

  return {
    messages,
    input,
    isLoading,
    isAiResponding,
    error,
    handleInputChange,
    handleSubmit,
    stopGeneration,
  };
}