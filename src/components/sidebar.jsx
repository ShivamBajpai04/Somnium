"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { PinIcon, PinOffIcon, Plus } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const presetPrompts = [
  "Tell me a joke",
  "Explain quantum computing",
  "Write a haiku about coding",
  "Describe the taste of an apple",
]

export default function Sidebar({ currentChatId }) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(true)
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChats()
  }, [])

  useEffect(() => {
    if (isPinned) return

    const handleMouseMove = (e) => {
      if (e.clientX < 20) {
        setIsHovered(true)
      } else if (e.clientX > 300) {
        setIsHovered(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isPinned])

  async function loadChats() {
    try {
      const response = await fetch("/api/chat")
      if (!response.ok) throw new Error('Failed to load chats')
      const data = await response.json()
      setChats(data)
    } catch (error) {
      console.error("Failed to load chats:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleNewChat(prompt) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt || "New Chat",
          context: "Starting a new conversation"
        }),
      })

      if (!response.ok) throw new Error('Failed to create new chat')
      
      const data = await response.json()
      
      // Navigate to the new chat
      router.push(`/chat/${data.chatId}`)
    } catch (error) {
      console.error("Failed to create new chat:", error)
    }
  }

  const shouldShow = isPinned || isHovered

  return (
    <aside
      className={`
        ${isPinned ? 'relative w-64 shrink-0' : 'fixed left-0 top-0 w-64'} 
        h-screen bg-white border-r shadow-lg 
        transform transition-all duration-300 ease-in-out 
        ${shouldShow ? 'translate-x-0' : '-translate-x-[calc(100%-8px)]'}
        z-50
      `}
      onMouseLeave={() => !isPinned && setIsHovered(false)}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">CHO-2 AI</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? "Enable hover mode" : "Pin sidebar"}
          >
            {isPinned ? <PinIcon className="h-4 w-4" /> : <PinOffIcon className="h-4 w-4" />}
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleNewChat()}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <h3 className="font-semibold mb-2">Chat History</h3>
        <div className="mb-4 space-y-1">
          {loading ? (
            <div className="text-sm text-gray-600">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="text-sm text-gray-600">No previous chats</div>
          ) : (
            chats.map((chat) => (
              <Button
                key={chat._id}
                variant="ghost"
                className="w-full justify-start text-left text-sm text-gray-600 hover:text-gray-900 truncate"
                onClick={() => router.push(`/chat/${chat._id}`)}
              >
                {chat.title}
              </Button>
            ))
          )}
        </div>

        <h3 className="font-semibold mb-2">Preset Prompts</h3>
        <ul>
          {presetPrompts.map((prompt, index) => (
            <li
              key={index}
              className="text-sm text-blue-600 cursor-pointer hover:underline mb-1"
              onClick={() => handleNewChat(prompt)}
            >
              {prompt}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

