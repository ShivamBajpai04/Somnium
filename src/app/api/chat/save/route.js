import { connectDB } from "@/lib/db"
import { Chat } from "@/lib/db/schema"
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await connectDB()
    const { chatId, content, role } = await req.json()
    
    const chat = await Chat.findById(chatId)
    if (!chat || chat.userId !== userId) {
      return new NextResponse("Chat not found", { status: 404 })
    }

    chat.messages.push({ content, role })
    await chat.save()

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Save Message Error:', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 