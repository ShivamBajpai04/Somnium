import { ChatService } from "@/lib/chat-service";
import { connectDB } from "@/lib/db";
import { Chat } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    const { message, chatId, context } = await req.json();

    const chatService = new ChatService(userId);
    
    let chatRecord;
    if (chatId) {
      chatRecord = await Chat.findById(chatId);
      if (!chatRecord || chatRecord.userId !== userId) {
        chatRecord = await Chat.create({
          userId,
          title: message.slice(0, 30) + "...",
          messages: []
        });
      }
    } else {
      chatRecord = await Chat.create({
        userId,
        title: message.slice(0, 30) + "...",
        messages: []
      });
    }

    // Store the user message
    chatRecord.messages.push({
      content: message,
      role: "user"
    });
    await chatRecord.save();

    // Create transform stream to handle AI responses
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let fullResponse = "";
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          try {
            const data = JSON.parse(line);
            if (data.response) {
              fullResponse += data.response;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: data.response })}\n\n`));
            }
          } catch (e) {
            console.error('Error parsing line:', line, e);
          }
        }
      },
      async flush(controller) {
        // Save the complete AI response
        chatRecord.messages.push({
          content: fullResponse,
          role: 'assistant'
        });
        await chatRecord.save();
      }
    });

    // Get AI response as stream
    const response = await chatService.sendMessage(
      chatRecord._id.toString(),
      message,
      context
    );

    // Pipe through transform stream
    const stream = response.body.pipeThrough(transformStream);
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Get chat history
export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    const userChats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(userChats);
  } catch (error) {
    console.error('Get Chats Error:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
