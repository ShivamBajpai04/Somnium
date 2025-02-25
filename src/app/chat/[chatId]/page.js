import { ChatPageClient } from './client-page'

export default function ChatPage({ params }) {
  const chatId = params.chatId
  return <ChatPageClient chatId={chatId} />
} 