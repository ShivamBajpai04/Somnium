"use client"

import { Sidebar } from "../../components/sidebar"
import { ChatArea } from "../../components/chat-area"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { AlertCircle } from "lucide-react"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import { useChat } from "@/hooks/useChat"
import { Loader2 } from "lucide-react"

export default function ChatPage() {
  const {
    messages,
    input,
    isLoading,
    isAiResponding,
    error,
    handleInputChange,
    handleSubmit,
    stopGeneration
  } = useChat()

  return (
    <>
      <SignedIn>
        <div className="flex h-screen bg-gray-100 relative">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            {error && (
              <Alert variant="destructive" className="m-4 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="mt-1">
                  {error.message || "Failed to communicate with the AI model. Please try again later."}
                </AlertDescription>
              </Alert>
            )}
            <div className="flex-1 overflow-auto">
              <ChatArea messages={messages} onStopGeneration={stopGeneration} />
            </div>
            <form onSubmit={handleSubmit} className="flex items-center p-4 bg-white border-t">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={isAiResponding ? "Please wait for AI to respond..." : "Type your message..."}
                className={`flex-1 mr-2 ${isAiResponding ? 'bg-gray-100' : ''}`}
                disabled={isLoading || isAiResponding}
              />
              {isAiResponding ? (
                <Button
                  type="button"
                  onClick={stopGeneration}
                  variant="destructive"
                  className="ml-2"
                >
                  Stop
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Send'
                  )}
                </Button>
              )}
            </form>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
} 