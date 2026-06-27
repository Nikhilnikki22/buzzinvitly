'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  id: number
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaLink: string
  gradient: string
  emoji: string
  features: string[]
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Beautiful Digital Invitations',
    subtitle: 'Create events that buzz',
    description: 'Design stunning invitations for birthdays, weddings, parties, and every special moment',
    ctaText: 'Browse Templates',
    ctaLink: '/templates',
    gradient: 'from-blue-600 via-purple-600 to-pink-600',
    emoji: '🎉',
    features: ['300+ Templates', 'Easy Customization', 'Instant Sharing']
  },
  {
    id: 2,
    title: 'Smart RSVP Tracking',
    subtitle: 'Know who\'s coming',
    description: 'Track responses in real-time, manage guest lists, and get instant notifications',
    ctaText: 'See How It Works',
    ctaLink: '/templates',
    gradient: 'from-green-600 via-teal-600 to-blue-600',
    emoji: '✅',
    features: ['Real-time Updates', 'Guest Management', 'Calendar Sync']
  },
  {
    id: 3,
    title: 'Send via Email Instantly',
    subtitle: 'Reach everyone in seconds',
    description: 'Send beautiful email invitations to all your guests with just one click',
    ctaText: 'Start Creating',
    ctaLink: '/auth/signup',
    gradient: 'from-orange-600 via-red-600 to-pink-600',
    emoji: '📧',
    features: ['Bulk Sending', 'Email Tracking', 'Resend Options']
  },
  {
    id: 4,
    title: 'Premium Templates & AI Design',
    subtitle: 'Stand out from the crowd',
    description: 'Access exclusive premium templates or generate custom designs with AI',
    ctaText: 'Explore Premium',
    ctaLink: '/templates?premium=true',
    gradient: 'from-purple-600 via-pink-600 to-rose-600',
    emoji: '✨',
    features: ['AI-Powered', 'Premium Collection', 'Unique Designs']
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Auto-advance slides
  useEffect(() => {
    if (isPaused || isAnimating) return

    const timer = setInterval(() => {
      nextSlide()
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [currentSlide, isPaused, isAnimating])

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const slide = slides[currentSlide]

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 min-h-[600px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-10 transition-all duration-1000`}
        />

        {/* Floating Elements */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full opacity-30"
                style={{
                  backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'][
                    Math.floor(Math.random() * 4)
                  ],
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Emoji */}
          <div
            className={`text-8xl mb-6 transition-all duration-500 ${
              isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'
            }`}
          >
            {slide.emoji}
          </div>

          {/* Subtitle */}
          <div
            className={`text-lg font-semibold text-gray-600 mb-4 transition-all duration-500 delay-100 ${
              isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            {slide.subtitle}
          </div>

          {/* Title */}
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-500 delay-200 ${
              isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <span className={`bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}>
              {slide.title}
            </span>
          </h1>

          {/* Description */}
          <p
            className={`text-xl text-gray-600 max-w-2xl mx-auto mb-8 transition-all duration-500 delay-300 ${
              isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            {slide.description}
          </p>

          {/* Features */}
          <div
            className={`flex flex-wrap justify-center gap-4 mb-10 transition-all duration-500 delay-400 ${
              isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            {slide.features.map((feature, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 text-sm font-medium text-gray-700"
              >
                ✓ {feature}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div
            className={`transition-all duration-500 delay-500 ${
              isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <Link
              href={slide.ctaLink}
              className={`inline-block bg-gradient-to-r ${slide.gradient} text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
            >
              {slide.ctaText} →
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-12 h-3 bg-gradient-to-r ' + slide.gradient
                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
            } disabled:cursor-not-allowed`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-sm font-semibold text-gray-700">
        {currentSlide + 1} / {slides.length}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
