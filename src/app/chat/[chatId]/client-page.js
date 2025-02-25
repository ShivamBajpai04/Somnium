"use client"

import ChatArea from "@/components/chat-area"
import Sidebar from "@/components/sidebar"
import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export function ChatPageClient({ chatId }) {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    redirect("/sign-in")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentChatId={chatId} />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ChatArea initialChatId={chatId} />
        </div>
      </div>
    </div>
  )
} 