'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function DeleteAccount() {
  const router = useRouter()
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }

    setError('')
    setIsDeleting(true)

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to delete account')
        setIsDeleting(false)
        return
      }

      // Sign out and redirect to home
      await signOut({ redirect: false })
      router.push('/')
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred')
      setIsDeleting(false)
    }
  }

  if (!isConfirming) {
    return (
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Danger Zone</h3>
        <p className="text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => setIsConfirming(true)}
          className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Delete Account
        </button>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-1">Delete Account</h3>
            <p className="text-sm text-red-800 mb-4">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="confirm" className="block text-sm font-medium text-red-900 mb-2">
                Type <strong>DELETE</strong> to confirm
              </label>
              <input
                id="confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="DELETE"
                disabled={isDeleting}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting || confirmText !== 'DELETE'}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'I understand, delete my account'}
              </button>
              <button
                onClick={() => {
                  setIsConfirming(false)
                  setConfirmText('')
                  setError('')
                }}
                disabled={isDeleting}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
