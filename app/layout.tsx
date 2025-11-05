import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ポケモン図鑑',
  description: 'ポケモンデータを表示するWebアプリケーション。151匹のポケモンを検索・比較できます。',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'ポケモン図鑑',
    description: 'ポケモンデータを表示するWebアプリケーション。151匹のポケモンを検索・比較できます。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'ポケモン図鑑',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'ポケモン図鑑',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ポケモン図鑑',
    description: 'ポケモンデータを表示するWebアプリケーション。151匹のポケモンを検索・比較できます。',
    images: ['/og-image.svg'],
  },
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
