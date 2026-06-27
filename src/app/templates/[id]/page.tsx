import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import UseTemplateButton from '@/components/use-template-button'

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      coinBalance: true,
      subscription: true,
    },
  })

  if (!user) {
    redirect('/auth/login')
  }

  const template = await prisma.template.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          favorites: true,
          events: true,
        },
      },
    },
  })

  if (!template) {
    notFound()
  }

  const canAfford = user.coinBalance >= template.coinCost || user.subscription === 'PRO'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <a
          href="/templates"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to Templates
        </a>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Template Preview */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative w-full aspect-[3/4]">
              <Image
                src={template.thumbnailUrl}
                alt={template.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Template Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-bold text-gray-900">
                  {template.name}
                </h1>
                {template.isPremium && (
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ⭐ Premium
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-600">{template.description}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {template.category.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Used by:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {template._count.events} people
                </span>
              </div>
              <div>
                <span className="text-gray-500">Favorites:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {template._count.favorites}
                </span>
              </div>
            </div>

            {/* Tags */}
            {template.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Color Palette */}
            {template.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Color Palette</h3>
                <div className="flex gap-2">
                  {template.colors.map((color, idx) => (
                    <div key={idx} className="text-center">
                      <div
                        className="w-12 h-12 rounded-lg shadow border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                      <p className="text-xs text-gray-600 mt-1 font-mono">{color}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">Price:</span>
                {template.coinCost === 0 ? (
                  <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    FREE
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-3xl font-bold text-gray-900">{template.coinCost}</span>
                  </div>
                )}
              </div>

              {user.subscription === 'PRO' && template.coinCost > 0 && (
                <p className="text-sm text-purple-700 font-medium mb-4">
                  ✨ FREE for PRO members!
                </p>
              )}

              {!canAfford && (
                <p className="text-sm text-red-600 font-medium mb-4">
                  ⚠️ You need {template.coinCost - user.coinBalance} more coins
                </p>
              )}

              <UseTemplateButton
                templateId={template.id}
                templateName={template.name}
                coinCost={template.coinCost}
                isPremium={template.isPremium}
                canAfford={canAfford}
                userCoins={user.coinBalance}
              />
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Fully customizable design</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Email & PDF export</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">RSVP tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Guest list management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
