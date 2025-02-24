"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "../components/ui/button"
import { useRouter } from "next/navigation"
import Spline from "@splinetool/react-spline"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen relative">
      {/* Spline background */}
      <div className="fixed inset-0">
        <Spline
          className="w-full h-screen"
          scene="https://prod.spline.design/DTnlUz1FEiMH6QC9/scene.splinecode"
        />
      </div>

      <h1 className="absolute right-24 top-[30vh] text-5xl font-bold text-white font-tech drop-shadow-glow text-center">
        CHO-2 AI
      </h1>

      <SignedOut>
        <Button
          onClick={() => router.push('/auth/signin')}
          className="absolute left-20 top-[45vh] capsule-button"
        >
          <span className="text-2xl">Login</span>
        </Button>

        <Button
          onClick={() => router.push('/auth/signup')}
          className="absolute right-40 top-[60vh] capsule-button"
        >
          <span className="text-2xl">Sign Up</span>
        </Button>
      </SignedOut>

      <SignedIn>
        <Button
          onClick={() => router.push('/chat')}
          className="absolute right-24 top-[45vh] capsule-button"
        >
          <span className="text-2xl">Chat</span>
        </Button>
      </SignedIn>
    </div>
  )
}


