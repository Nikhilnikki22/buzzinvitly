import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TemplateGrid from '@/components/template-grid'

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const { category, search } = await searchParams
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      coinBalance: true,
      favorites: {
        select: {
          templateId: true,
        },
      },
    },
  })

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch templates
  const templates = await prisma.template.findMany({
    where: {
      AND: [
        category ? { category: category as any } : {},
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    },
    include: {
      _count: {
        select: {
          favorites: true,
        },
      },
    },
    orderBy: [
      { isPremium: 'desc' },
      { usageCount: 'desc' },
    ],
  })

  const favoriteIds = new Set(user.favorites.map((f) => f.templateId))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Browse Templates
          </h1>
          <p className="text-gray-600">
            Choose from our collection of beautiful invitation templates
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <a
            href="/templates"
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              !category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </a>
          {['BIRTHDAY', 'WEDDING', 'BABY_SHOWER', 'ANNIVERSARY', 'GRADUATION', 'HOLIDAY', 'CORPORATE', 'PARTY'].map(
            (cat) => (
              <a
                key={cat}
                href={`/templates?category=${cat}`}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.replace('_', ' ')}
              </a>
            )
          )}
        </div>

        {/* Search */}
        <div className="mb-8">
          <form action="/templates" method="get" className="max-w-md">
            <input
              type="text"
              name="search"
              placeholder="Search templates..."
              defaultValue={search}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>
        </div>

        {/* Templates Grid */}
        {templates.length > 0 ? (
          <TemplateGrid
            templates={templates as any}
            favoriteIds={favoriteIds}
            userId={user.id}
            userCoins={user.coinBalance}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No templates found</p>
          </div>
        )}
      </div>
    </div>
  )
}
