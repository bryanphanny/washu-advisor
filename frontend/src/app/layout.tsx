import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/components/AuthProvider"

export const metadata: Metadata = {
  title: "WashU Academic Advisor",
  description: "CS degree planner and career advisor for WashU students",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
