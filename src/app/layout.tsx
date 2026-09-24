import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'QRMenu - Restoranlar uchun AI yordamida QR menyu platformasi',
  description: 'Eski qog\'oz menyu rasmini yuklang, AI yordamida daqiqalarda interaktiv, zamonaviy va chiroyli QR menyu yarating.',
  keywords: ['QR menyu', 'restoran menyusi', 'AI menyu', 'raqamli menyu', 'QRMenu SaaS'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
