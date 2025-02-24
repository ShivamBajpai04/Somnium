"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "../components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to AI Chat App
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience intelligent conversations powered by advanced AI
          </p>

          <SignedOut>
            <div className="space-x-4">
              <Button
                onClick={() => router.push('/auth/signin')}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push('/auth/signup')}
                variant="outline"
              >
                Sign Up
              </Button>
            </div>
          </SignedOut>

          <SignedIn>
            <Button
              onClick={() => router.push('/chat')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Go to Chat
            </Button>
          </SignedIn>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Real-time Chat"
              description="Engage in natural conversations with our AI assistant in real-time"
            />
            <FeatureCard
              title="Smart Responses"
              description="Get intelligent and contextual responses powered by advanced AI"
            />
            <FeatureCard
              title="Secure & Private"
              description="Your conversations are protected with enterprise-grade security"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

