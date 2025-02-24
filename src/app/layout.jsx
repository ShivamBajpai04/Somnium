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
  title: "AI Chat App",
  description: "An intuitive AI chat application",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="absolute top-4 right-4 z-50">
            <SignedOut>
              <SignInButton mode="redirect">
                <Button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/auth/signin" />
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

