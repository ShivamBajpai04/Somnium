import "./globals.css"
import {
  ClerkProvider,
} from '@clerk/nextjs'

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
        <body>
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}

