import { Inter } from "next/font/google"
import "./globals.css"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Button } from "@/components/ui/button"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CHO-2 AI Chat",
  description: "An intuitive AI chat application",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider afterSignOutUrl="/auth/signin">
      <html lang="en">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body className={inter.className}>
          <div className="absolute top-4 right-4 z-50">

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}

