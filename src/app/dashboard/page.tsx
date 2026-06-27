import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import UserAccountDropdown from '@/components/user-account-dropdown'
import AnimatedHero from '@/components/animated-hero'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch templates by category
  const birthdayTemplates = await prisma.template.findMany({
    where: { category: 'BIRTHDAY' },
    take: 1,
    orderBy: { usageCount: 'desc' },
  })

  const weddingTemplates = await prisma.template.findMany({
    where: { category: 'WEDDING' },
    take: 1,
    orderBy: { usageCount: 'desc' },
  })

  const babyShowerTemplates = await prisma.template.findMany({
    where: { category: 'BABY_SHOWER' },
    take: 1,
    orderBy: { usageCount: 'desc' },
  })

  const partyTemplates = await prisma.template.findMany({
    where: { category: 'PARTY' },
    take: 1,
    orderBy: { usageCount: 'desc' },
  })

  const popularTemplates = await prisma.template.findMany({
    take: 8,
    orderBy: { usageCount: 'desc' },
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Top Pink Banner */}
      <div className="bg-pink-200 text-center py-2 px-4 text-sm">
        Create beautiful digital invitations in minutes ✨{' '}
        <Link href="/templates" className="underline font-medium">
          Browse all templates
        </Link>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard">
              <h1 className="text-2xl italic text-gray-900" style={{ fontFamily: 'cursive' }}>
                BuzzInvitly
              </h1>
            </Link>

            {/* Center Navigation */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-medium">
              <Link href="/templates" className="text-pink-600 hover:text-pink-700 uppercase tracking-wide">
                CARD INVITATIONS
              </Link>
              <Link href="/templates" className="text-pink-600 hover:text-pink-700 uppercase tracking-wide">
                GREETING CARDS
              </Link>
              <Link href="/templates" className="text-pink-600 hover:text-pink-700 uppercase tracking-wide">
                MAKE YOUR OWN
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <UserAccountDropdown
                userName={session.user.name}
                userEmail={session.user.email!}
                coinBalance={session.user.coinBalance}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <AnimatedHero featuredTemplateUrl={popularTemplates[0]?.thumbnailUrl} />

      {/* Explore by category */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-light text-gray-900 text-center mb-12">
            Explore by category
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* Birthday */}
            {birthdayTemplates.length > 0 && (
              <Link href="/templates?category=BIRTHDAY" className="group">
                <div className="bg-orange-50 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Birthday</h4>
                  <div className="relative w-full h-48">
                    <Image
                      src={birthdayTemplates[0].thumbnailUrl}
                      alt="Birthday cards"
                      fill
                      className="object-cover rounded shadow-md transform rotate-2"
                    />
                  </div>
                </div>
              </Link>
            )}

            {/* Kids' birthday */}
            {birthdayTemplates.length > 0 && (
              <Link href="/templates?category=BIRTHDAY" className="group">
                <div className="bg-orange-50 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Kids' birthday</h4>
                  <div className="relative w-full h-48">
                    <Image
                      src={birthdayTemplates[0].thumbnailUrl}
                      alt="Kids birthday"
                      fill
                      className="object-cover rounded shadow-md transform -rotate-2"
                    />
                  </div>
                </div>
              </Link>
            )}

            {/* Adult birthday */}
            {birthdayTemplates.length > 0 && (
              <Link href="/templates?category=BIRTHDAY" className="group">
                <div className="bg-orange-50 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Adult birthday</h4>
                  <div className="relative w-full h-48">
                    <Image
                      src={birthdayTemplates[0].thumbnailUrl}
                      alt="Adult birthday"
                      fill
                      className="object-cover rounded shadow-md transform rotate-1"
                    />
                  </div>
                </div>
              </Link>
            )}

            {/* Baby shower */}
            {babyShowerTemplates.length > 0 && (
              <Link href="/templates?category=BABY_SHOWER" className="group">
                <div className="bg-orange-50 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Baby shower</h4>
                  <div className="relative w-full h-48">
                    <Image
                      src={babyShowerTemplates[0].thumbnailUrl}
                      alt="Baby shower"
                      fill
                      className="object-cover rounded shadow-md transform -rotate-1"
                    />
                  </div>
                </div>
              </Link>
            )}

            {/* Wedding */}
            {weddingTemplates.length > 0 && (
              <Link href="/templates?category=WEDDING" className="group">
                <div className="bg-orange-50 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Wedding</h4>
                  <div className="relative w-full h-48">
                    <Image
                      src={weddingTemplates[0].thumbnailUrl}
                      alt="Wedding invitations"
                      fill
                      className="object-cover rounded shadow-md transform rotate-2"
                    />
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Popular designs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-light text-gray-900 text-center mb-12">
            Popular designs
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {popularTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/templates/${template.id}`}
                className="group"
              >
                <div className="relative w-full h-56 bg-white rounded mb-3 overflow-hidden shadow-sm">
                  <Image
                    src={template.thumbnailUrl}
                    alt={template.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                  {template.name}
                </h4>
                <p className="text-xs text-gray-500">BuzzInvitly</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 uppercase text-xs mb-4 tracking-wide">HELP</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">FAQ</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Contact us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 uppercase text-xs mb-4 tracking-wide">COMPANY</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">About</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 uppercase text-xs mb-4 tracking-wide">LEARN</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/templates" className="hover:text-gray-900">Online invitations</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Product features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 uppercase text-xs mb-4 tracking-wide">CONNECT</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">Instagram</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Facebook</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
            © 2026 BuzzInvitly
          </div>
        </div>
      </footer>
    </div>
  )
}
