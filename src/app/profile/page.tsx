import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileForm from '@/components/profile-form'
import PasswordChangeForm from '@/components/password-change-form'
import DeleteAccount from '@/components/delete-account'
import AccountStats from '@/components/account-stats'
import CoinManagement from '@/components/coin-management'
import SubscriptionManagement from '@/components/subscription-management'
import NotificationPreferences from '@/components/notification-preferences'

export default async function ProfilePage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎉 BuzzInvitly
            </h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Profile & Settings</h2>
          <p className="text-gray-600 mt-2">
            Manage your account, preferences, and subscription
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Account */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information Card */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                {/* Avatar */}
                <div className="relative">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                      {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>

                {/* User Info */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{session.user.name}</h3>
                  <p className="text-gray-600">{session.user.email}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {session.user.subscription} Plan
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {session.user.coinBalance} Coins
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form */}
              <ProfileForm user={session.user} />
            </div>

            {/* Account Statistics */}
            <AccountStats />

            {/* Change Password Card */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
              <PasswordChangeForm />
            </div>

            {/* Notification Preferences */}
            <NotificationPreferences />

            {/* Delete Account Card */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <DeleteAccount />
            </div>
          </div>

          {/* Right Column - Billing & Subscription */}
          <div className="space-y-6">
            {/* Coin Management */}
            <CoinManagement coinBalance={session.user.coinBalance || 0} />

            {/* Subscription Management */}
            <SubscriptionManagement subscription={session.user.subscription || 'FREE'} />
          </div>
        </div>
      </main>
    </div>
  )
}
