import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ポケモン図鑑',
  description: 'ポケモンデータを表示するWebアプリケーション',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
