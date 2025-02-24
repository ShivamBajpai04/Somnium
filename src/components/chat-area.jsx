import { ScrollArea } from "./ui/scroll-area"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react'
import { Button } from "./ui/button"

export function ChatArea({ messages, onStopGeneration }) {
  const scrollRef = useRef(null);
  const [openThinkBlocks, setOpenThinkBlocks] = useState(new Set());
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Debug log to see message updates
  console.log('Rendering messages:', messages);

  const copyToClipboard = async (code, id) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderContent = (content, messageId) => {
    // Check if content contains a thinking block
    const thinkMatch = content.match(/<think>(.*?)<\/think>/s);
    if (thinkMatch) {
      const thinkingContent = thinkMatch[1];
      const actualContent = content.split('</think>')[1];
      const isOpen = openThinkBlocks.has(messageId);

      return (
        <>
          <details
            open={isOpen}
            onToggle={(e) => {
              if (e.target.open) {
                setOpenThinkBlocks(prev => new Set([...prev, messageId]));
              } else {
                setOpenThinkBlocks(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(messageId);
                  return newSet;
                });
              }
            }}
            className="mb-2"
          >
            <summary className="flex items-center gap-1 text-gray-500 italic mb-1 hover:text-gray-700 transition-colors cursor-pointer">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Thinking process
            </summary>
            <div className="text-gray-500 italic pl-5">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeId = `${messageId}-think-${Math.random()}`;
                    return !inline && match ? (
                      <div className="relative group">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(String(children), codeId)}
                        >
                          {copiedCode === codeId ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {thinkingContent.trim()}
              </ReactMarkdown>
            </div>
          </details>
          {actualContent && (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeId = `${messageId}-main-${Math.random()}`;
                  return !inline && match ? (
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(String(children), codeId)}
                      >
                        {copiedCode === codeId ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {actualContent.trim()}
            </ReactMarkdown>
          )}
        </>
      );
    }

    // If no think block, just render as markdown with syntax highlighting
    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeId = `${messageId}-${Math.random()}`;
            return !inline && match ? (
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(String(children), codeId)}
                >
                  {copiedCode === codeId ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <ScrollArea className="flex-1 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
        >
          <div
            className={`inline-block p-2 rounded-lg ${message.role === "user"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
              }`}
          >
            {renderContent(message.content, message.id)}
          </div>
        </div>
      ))}
      <div ref={scrollRef} />
    </ScrollArea>
  );
}

