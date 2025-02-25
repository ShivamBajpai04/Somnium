import ChatPageClient from './client-page'

// Server Component
export default async function ChatPage({ params }) {
  const {chatId} = await params
  return <ChatPageClient chatId={chatId} />
} 