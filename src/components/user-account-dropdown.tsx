'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface UserAccountDropdownProps {
  userName: string | null
  userEmail: string
  coinBalance: number
}

export default function UserAccountDropdown({ userName, userEmail, coinBalance }: UserAccountDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const displayName = userName || userEmail.split('@')[0]

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="text-sm text-gray-700 hover:text-gray-900 font-medium"
      >
        {displayName}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-4 z-50">
          {/* Your Account Section */}
          <div className="px-6 pb-4 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">
              YOUR ACCOUNT
            </h3>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-gray-900 font-medium">{coinBalance} Coins</span>
              </div>
              <Link href="/coins/purchase" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Buy Coins
              </Link>
            </div>

            <p className="text-sm text-gray-600">
              Running multiple events? Keep the buzz alive while cutting the chaos with a{' '}
              <Link href="/subscription" className="text-blue-600 hover:text-blue-700 font-medium">
                BuzzInvitly Pro subscription
              </Link>
              .
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/my-events"
              onClick={() => setIsOpen(false)}
              className="block px-6 py-2.5 text-gray-900 hover:bg-gray-50 text-sm"
            >
              My Events
            </Link>
            <Link
              href="/my-events?filter=drafts"
              onClick={() => setIsOpen(false)}
              className="block px-6 py-2.5 text-gray-900 hover:bg-gray-50 text-sm"
            >
              Drafts
            </Link>
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="block px-6 py-2.5 text-gray-900 hover:bg-gray-50 text-sm"
            >
              Account Settings
            </Link>
            <Link
              href="/help"
              onClick={() => setIsOpen(false)}
              className="block px-6 py-2.5 text-gray-900 hover:bg-gray-50 text-sm"
            >
              Help Center
            </Link>
            <button
              onClick={() => {
                setIsOpen(false)
                signOut({ callbackUrl: '/' })
              }}
              className="block w-full text-left px-6 py-2.5 text-gray-900 hover:bg-gray-50 text-sm"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
