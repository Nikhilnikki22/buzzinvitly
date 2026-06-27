'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Template {
  id: string
  name: string
  description: string | null
  category: string
  thumbnailUrl: string
  isPremium: boolean
  coinCost: number
  tags: string[]
  colors: string[]
  _count: {
    favorites: number
  }
}

interface TemplateGridProps {
  templates: Template[]
  favoriteIds: Set<string>
  userId: string
  userCoins: number
}

export default function TemplateGrid({
  templates,
  favoriteIds,
  userId,
  userCoins,
}: TemplateGridProps) {
  const router = useRouter()
  const [favorites, setFavorites] = useState(favoriteIds)
  const [loadingFavorite, setLoadingFavorite] = useState<string | null>(null)

  const toggleFavorite = async (templateId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setLoadingFavorite(templateId)

    try {
      const isFavorite = favorites.has(templateId)
      const method = isFavorite ? 'DELETE' : 'POST'

      const response = await fetch('/api/templates/favorite', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })

      if (response.ok) {
        setFavorites((prev) => {
          const newSet = new Set(prev)
          if (isFavorite) {
            newSet.delete(templateId)
          } else {
            newSet.add(templateId)
          }
          return newSet
        })
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setLoadingFavorite(null)
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {templates.map((template) => {
        const isFavorite = favorites.has(template.id)
        const canAfford = userCoins >= template.coinCost

        return (
          <div key={template.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/templates/${template.id}`}>
              {/* Image */}
              <div className="relative w-full h-48 bg-gray-200">
                <Image
                  src={template.thumbnailUrl}
                  alt={template.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />

                {/* Premium Badge */}
                {template.isPremium && (
                  <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                    ⭐ Premium
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(template.id, e)}
                  disabled={loadingFavorite === template.id}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50"
                >
                  <svg
                    className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                    fill={isFavorite ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>

                {/* Favorites Count */}
                {template._count.favorites > 0 && (
                  <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3 fill-red-500" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{template._count.favorites}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {template.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  {template.coinCost === 0 ? (
                    <span className="bg-green-100 text-green-700 font-bold text-xs px-2 py-1 rounded">
                      FREE
                    </span>
                  ) : (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                      <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <span className={`font-bold text-xs ${canAfford ? 'text-yellow-900' : 'text-red-600'}`}>
                        {template.coinCost}
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-blue-600 font-medium">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
