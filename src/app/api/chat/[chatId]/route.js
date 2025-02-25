import { connectDB } from "@/lib/db"
import { Chat } from "@/lib/db/schema"
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await connectDB()
    const chatId = params.chatId
    const chat = await Chat.findById(chatId)

    if (!chat || chat.userId !== userId) {
      return new NextResponse("Chat not found", { status: 404 })
    }

    return NextResponse.json(chat)
  } catch (error) {
    console.error("Get Chat Error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 