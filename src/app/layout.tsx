import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthSessionProvider from '@/components/providers/session-provider'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BuzzInvitly - Create Events That Buzz',
  description: 'Beautiful digital invitations for every occasion. Create, customize, and send stunning event invitations with RSVP tracking and analytics.',
  keywords: ['invitations', 'events', 'RSVP', 'party planning', 'digital invitations', 'event management'],
  authors: [{ name: 'BuzzInvitly Team' }],
  creator: 'BuzzInvitly',
  publisher: 'BuzzInvitly',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BuzzInvitly',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'BuzzInvitly',
    title: 'BuzzInvitly - Create Events That Buzz',
    description: 'Beautiful digital invitations for every occasion',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuzzInvitly - Create Events That Buzz',
    description: 'Beautiful digital invitations for every occasion',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#3B82F6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="application-name" content="BuzzInvitly" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BuzzInvitly" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        <AuthSessionProvider>{children}</AuthSessionProvider>

        {/* Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('✅ Service Worker registered:', registration.scope);
                  },
                  function(err) {
                    console.log('❌ Service Worker registration failed:', err);
                  }
                );
              });
            }
          `}
        </Script>

        {/* Web Vitals Reporting */}
        <Script id="web-vitals" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined') {
              import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
                onCLS(console.log);
                onFID(console.log);
                onFCP(console.log);
                onLCP(console.log);
                onTTFB(console.log);
              }).catch(() => {});
            }
          `}
        </Script>
      </body>
    </html>
  )
}
