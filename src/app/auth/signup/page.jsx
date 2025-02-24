"use client"
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-gray-600">Get started with AI Chat</p>
      </div>
      <SignUp fallbackRedirectUrl="/chat" routing="path" />
      <p className="mt-4 text-gray-600">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
