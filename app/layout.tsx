import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* THE NUCLEAR FIX: FORCING TAILWIND CSS DIRECTLY IN BROWSER */}
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body className="bg-[#020614] text-white m-0 p-0 overflow-x-hidden">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
