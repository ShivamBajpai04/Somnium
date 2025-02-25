import ChatPageClient from './client-page'

// Server Component
export default async function ChatPage({ params }) {
  const chatId = params.chatId

  return <ChatPageClient chatId={chatId} />
} 