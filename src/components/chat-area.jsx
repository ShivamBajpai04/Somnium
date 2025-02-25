"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Loader2, Check, Copy, ChevronDown, ChevronUp } from "lucide-react"
import Prism from 'prismjs'
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-json"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-markdown"

export default function ChatArea({ initialChatId }) {
  const [message, setMessage] = useState("")
  const [chatId, setChatId] = useState(initialChatId)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentResponse, setCurrentResponse] = useState("")
  const [thinking, setThinking] = useState(false)

  useEffect(() => {
    if (initialChatId) {
      loadChat(initialChatId)
    } else {
      loadChats()
    }
  }, [initialChatId])

  async function loadChat(id) {
    try {
      setLoading(true)
      const response = await fetch(`/api/chat/${id}`)
      if (!response.ok) throw new Error('Failed to load chat')
      
      const chat = await response.json()
      setChatId(chat._id)
      setMessages(chat.messages)
    } catch (error) {
      console.error("Failed to load chat:", error)
      setError("Failed to load chat")
    } finally {
      setLoading(false)
    }
  }

  async function loadChats() {
    try {
      setLoading(true)
      const response = await fetch("/api/chat")
      if (!response.ok) throw new Error('Failed to load chats')
      
      const chats = await response.json()
      if (chats.length > 0) {
        setChatId(chats[0]._id)
        setMessages(chats[0].messages)
      }
    } catch (error) {
      console.error("Failed to load chats:", error)
      setError("Failed to load chat history")
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    setError(null)
    setCurrentResponse("")
    setThinking(true)
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: "user", content: message }])
    const currentMessage = message
    setMessage("")
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentMessage,
          chatId,
          context: "You are CHO-2, an advanced AI assistant. Format your responses using markdown when appropriate. Use code blocks with language specification for code. Be concise but thorough."
        })
      })

      if (!response.ok) throw new Error('Failed to send message')
      setThinking(false)

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let aiResponse = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        
        const text = decoder.decode(value)
        const lines = text.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(5))
              if (data.content) {
                aiResponse += data.content
                setCurrentResponse(aiResponse)
              }
            } catch (e) {
              console.error('Error parsing line:', line, e)
            }
          }
        }
      }

      // Add final AI response to messages
      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }])
      
    } catch (error) {
      console.error("Failed to send message:", error)
      setError("Failed to send message")
    } finally {
      setLoading(false)
      setCurrentResponse("")
      setThinking(false)
    }
  }

  function CodeBlock({ language, value }) {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
      if (value) {
        Prism.highlightAll()
      }
    }, [value])

    const copyCode = useCallback(() => {
      if (value) {
        navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }, [value])

    if (!value) return null

    return (
      <div className="relative group">
        <pre className={`language-${language || 'plaintext'} rounded-md !p-4`}>
          <code className={`language-${language || 'plaintext'}`}>
            {value}
          </code>
        </pre>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={copyCode}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    )
  }

  function CollapsibleThinking({ content }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="border-l-4 border-blue-500 pl-4 my-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span className="font-medium">Thinking Process</span>
        </button>
        <div
          className={`overflow-hidden transition-all duration-200 ${
            isOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="py-2 text-gray-600">
            <MessageContent content={content} />
          </div>
        </div>
      </div>
    )
  }

  function MessageContent({ content }) {
    if (!content) return null;
    
    // Handle thinking sections
    const parts = content.split(/<think>|<\/think>/)
    if (parts.length > 1) {
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {parts.map((part, index) => {
            if (index % 2 === 1) {
              // This is a thinking section
              return <CollapsibleThinking key={index} content={part} />
            } else {
              // This is regular content
              return part && (
                <div key={index}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      p: ({ children }) => <div className="my-2">{children}</div>,
                      pre: ({ children }) => <div className="my-4">{children}</div>,
                      code: ({ node, inline, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '')
                        const language = match ? match[1] : ''
                        
                        if (inline) {
                          return (
                            <code className="bg-gray-200 dark:bg-gray-800 rounded px-1 py-0.5" {...props}>
                              {children}
                            </code>
                          )
                        }

                        return (
                          <CodeBlock
                            language={language}
                            value={String(children).replace(/\n$/, '')}
                          />
                        )
                      }
                    }}
                  >
                    {String(part)}
                  </ReactMarkdown>
                </div>
              )
            }
          })}
        </div>
      )
    }

    // Regular message without thinking sections
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            p: ({ children }) => <div className="my-2">{children}</div>,
            pre: ({ children }) => <div className="my-4">{children}</div>,
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '')
              const language = match ? match[1] : ''
              
              if (inline) {
                return (
                  <code className="bg-gray-200 dark:bg-gray-800 rounded px-1 py-0.5" {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  language={language}
                  value={String(children).replace(/\n$/, '')}
                />
              )
            }
          }}
        >
          {String(content)}
        </ReactMarkdown>
      </div>
    )
  }

  if (loading && messages.length === 0) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {msg.role === "assistant" ? (
                <MessageContent content={msg.content} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-black max-w-[80%] rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </div>
          </div>
        )}
        {currentResponse && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-black max-w-[80%] rounded-lg p-3">
              <MessageContent content={currentResponse} />
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="text-red-500">{error}</div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  )
}

