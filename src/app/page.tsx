import HeroCarousel from '@/components/hero-carousel'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="font-semibold text-xl mb-3 text-gray-900">Beautiful Templates</h3>
            <p className="text-gray-600">
              Choose from hundreds of professionally designed templates for every occasion
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-semibold text-xl mb-3 text-gray-900">AI-Powered Design</h3>
            <p className="text-gray-600">
              Generate stunning custom designs from simple text prompts using AI
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-semibold text-xl mb-3 text-gray-900">Smart Analytics</h3>
            <p className="text-gray-600">
              Track RSVPs, engagement, and measure your event's success with Buzz Score™
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
