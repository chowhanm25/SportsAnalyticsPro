import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import {ClerkProvider, SignInButton,
  SignedIn,
  SignedOut,
  UserButton}  from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PredictSquad - Sports Prediction Dashboard',
  description: 'Advanced sports prediction and analytics platform',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    // {<SignedOut>
    //   <SignInButton />
    // </SignedOut>
    // <SignedIn>
    //   <UserButton />
    // </SignedIn>
    // </ClerkProvider> }
  )
}