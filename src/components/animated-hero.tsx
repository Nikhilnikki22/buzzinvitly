'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AnimatedHeroProps {
  featuredTemplateUrl?: string
}

interface Slide {
  id: number
  title: string
  highlight: string
  ctaText: string
  ctaLink: string
  gradient: string
  layout?: 'default' | 'centered' | 'full' | 'magical' | 'envelope'
  emoji?: string
  subtitle?: string
  features?: string[]
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Turn life's moments into ",
    highlight: "celebrations",
    ctaText: "CREATE YOUR INVITATION",
    ctaLink: "/templates",
    gradient: "from-blue-600 via-purple-600 to-pink-600",
    layout: 'default'
  },
  {
    id: 2,
    title: "Send beautiful invites that make guests ",
    highlight: "excited",
    ctaText: "BROWSE TEMPLATES",
    ctaLink: "/templates",
    gradient: "from-pink-600 via-rose-600 to-red-600",
    layout: 'envelope',
    features: ["Instant Email Delivery", "Beautiful Templates", "Personal Touch", "Track Opens"]
  },
  {
    id: 3,
    title: "Smart RSVP Tracking",
    highlight: "Know exactly who's coming",
    ctaText: "GET STARTED FREE",
    ctaLink: "/templates",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    layout: 'centered',
    emoji: "✅",
    subtitle: "Real-time guest management at your fingertips",
    features: ["Live Response Tracking", "Automatic Reminders", "Guest Analytics", "Export Lists"]
  },
  {
    id: 4,
    title: "AI-Powered Design Magic",
    highlight: "Create stunning invites in seconds",
    ctaText: "TRY AI DESIGNER",
    ctaLink: "/templates?premium=true",
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    layout: 'full',
    emoji: "✨",
    subtitle: "Just describe your vision, watch it come to life",
    features: ["AI Text-to-Design", "Smart Color Palettes", "Auto-Layout", "Premium Templates"]
  },
  {
    id: 5,
    title: "Watch the Magic Unfold",
    highlight: "From sealed envelope to heartfelt reveal — in one tap",
    ctaText: "SEE IT IN ACTION",
    ctaLink: "/templates",
    gradient: "from-amber-200 via-yellow-300 to-rose-300",
    layout: 'magical',
    subtitle: "Send digital invitations that feel like opening a treasured letter. Elegant animations bring every moment to life.",
    features: ["Envelope Opening Animation", "Realistic 3D Depth & Shadows", "Seamless Phone Reveal", "Custom Wax Seal & Details"]
  }
]

export default function AnimatedHero({ featuredTemplateUrl }: AnimatedHeroProps) {
  const [mounted, setMounted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-advance slides
  useEffect(() => {
    if (isPaused || isAnimating) return

    const timer = setInterval(() => {
      nextSlide()
    }, 6000) // Change slide every 6 seconds

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
    <section
      className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 min-h-[500px] flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-orange-400/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Only render random animations after client mount to avoid hydration errors */}
      {mounted && (
        <>
          {/* Floating Confetti Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
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
                  className="w-2 h-2 rounded-full opacity-40"
                  style={{
                    backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'][
                      Math.floor(Math.random() * 5)
                    ],
                  }}
                />
              </div>
            ))}
          </div>

          {/* Sparkle Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute animate-sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              >
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>
            ))}
          </div>

          {/* Flying Envelopes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={`envelope-${i}`}
                className="absolute animate-fly-envelope"
                style={{
                  left: `${-10 + Math.random() * 20}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 6}s`,
                  animationDuration: `25s`,
                }}
              >
                <svg className="w-10 h-10 text-pink-400 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
            ))}
          </div>

          {/* Paper Planes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={`plane-${i}`}
                className="absolute animate-fly-plane"
                style={{
                  left: `${-10}%`,
                  top: `${15 + i * 20}%`,
                  animationDelay: `${i * 7}s`,
                  animationDuration: `28s`,
                }}
              >
                <svg className="w-12 h-12 text-blue-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </div>
            ))}
          </div>

          {/* Floating Mini Invitation Cards */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={`card-${i}`}
                className="absolute animate-flip-card"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${-20}%`,
                  animationDelay: `${i * 5}s`,
                  animationDuration: `30s`,
                }}
              >
                <div className="w-8 h-10 rounded bg-gradient-to-br from-purple-300 to-pink-300 opacity-50 shadow-lg" />
              </div>
            ))}
          </div>

          {/* Heart Trails */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={`heart-${i}`}
                className="absolute animate-heart-float"
                style={{
                  left: `${15 + i * 18}%`,
                  bottom: `${-10}%`,
                  animationDelay: `${i * 5}s`,
                  animationDuration: `22s`,
                }}
              >
                <svg className="w-6 h-6 text-red-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            ))}
          </div>

          {/* Celebration Ribbons */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={`ribbon-${i}`}
                className="absolute animate-ribbon-fall"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${-20}%`,
                  animationDelay: `${i * 7}s`,
                  animationDuration: `28s`,
                }}
              >
                <div
                  className="w-1.5 h-20 opacity-50"
                  style={{
                    background: `linear-gradient(to bottom, ${['#FF6B9D', '#C084FC', '#60A5FA', '#34D399'][i]}, transparent)`,
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Layout: Default (Slides 1 & 2) */}
        {slide.layout === 'default' && (
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Text */}
            <div className={`transform transition-all duration-500 ${
              isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
            }`}>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 leading-tight">
                {slide.title}
                <span className="inline-block animate-text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-300% font-semibold">
                  {slide.highlight}
                </span>
                {currentSlide === 0 && (
                  <>
                    {' '}with invitations that{' '}
                    <span className="inline-block">
                      sparkle
                      <svg className="inline-block w-8 h-8 ml-2 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path className="text-yellow-400" d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                      </svg>
                    </span>
                  </>
                )}
              </h2>
              <Link
                href={slide.ctaLink}
                className={`inline-block bg-gradient-to-r ${slide.gradient} text-white px-8 py-3 text-sm font-medium tracking-widest uppercase hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg rounded`}
              >
                {slide.ctaText}
              </Link>
            </div>

            {/* Right - Hero Card with 3D Effect */}
            <div className={`flex justify-center lg:justify-end transform transition-all duration-500 ${
              isAnimating ? 'opacity-0 -translate-x-10' : 'opacity-100 translate-x-0'
            }`}>
              {featuredTemplateUrl && (
                <div className="relative w-64 h-80 group">
                  {/* Floating particles around card (Slide 1 only) */}
                  {currentSlide === 0 && mounted && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={`card-particle-${i}`}
                          className="absolute animate-card-sparkle"
                          style={{
                            left: `${10 + Math.random() * 80}%`,
                            top: `${10 + Math.random() * 80}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                          }}
                        >
                          {i % 3 === 0 ? (
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                            </svg>
                          ) : i % 3 === 1 ? (
                            <div className="w-2 h-2 rounded-full bg-pink-400" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-purple-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient.replace('from-', 'from-').replace('via-', 'via-').replace('to-', 'to-')}/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500`} />
                  <div className="relative w-full h-full transform rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                    <Image
                      src={featuredTemplateUrl}
                      alt="Featured invitation"
                      fill
                      className="object-cover rounded-lg shadow-2xl"
                    />
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Layout: Envelope (Slide 2 - Guest Excitement) */}
        {slide.layout === 'envelope' && (
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Text & Features */}
            <div className={`transform transition-all duration-500 ${
              isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
            }`}>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 leading-tight">
                {slide.title}
                <span className="inline-block animate-text-gradient bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent bg-300% font-semibold">
                  {slide.highlight}
                </span>
              </h2>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {slide.features?.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-pink-200/50 transform transition-all duration-500 ${
                      isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                    }`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <p className="text-sm font-medium bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href={slide.ctaLink}
                className={`inline-block bg-gradient-to-r ${slide.gradient} text-white px-8 py-3 text-sm font-medium tracking-widest uppercase hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg rounded`}
              >
                {slide.ctaText}
              </Link>
            </div>

            {/* Right - Envelope Animation */}
            <div className={`flex justify-center lg:justify-end transform transition-all duration-500 ${
              isAnimating ? 'opacity-0 -translate-x-10' : 'opacity-100 translate-x-0'
            }`}>
              <div className="relative w-full max-w-sm" style={{ height: '320px' }}>
                {/* Envelope with opening animation */}
                <div className="envelope2-container">
                  {/* Envelope body */}
                  <div className="envelope2-body">
                    {/* Envelope flap */}
                    <div className="envelope2-flap"></div>

                    {/* Welcome card sliding out */}
                    <div className="welcome-card">
                      <div className="welcome-content">
                        <div className="welcome-title">Welcome to BuzzInvitly</div>
                        <div className="welcome-divider"></div>
                        <div className="welcome-message">You are invited!</div>
                        <div className="welcome-hearts">💕</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layout: Centered (Slide 3 - RSVP) */}
        {slide.layout === 'centered' && (
          <div className="text-center max-w-4xl mx-auto">
            <div className={`transform transition-all duration-500 ${
              isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
              {/* Large Emoji */}
              <div className="text-7xl mb-4 animate-bounce-slow">
                {slide.emoji}
              </div>

              {/* Title */}
              <h2 className="text-4xl lg:text-5xl font-bold mb-3">
                <span className={`bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}>
                  {slide.title}
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-xl text-gray-700 mb-3 font-light">
                {slide.highlight}
              </p>

              <p className="text-base text-gray-600 mb-6">
                {slide.subtitle}
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {slide.features?.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 transform transition-all duration-300 hover:scale-110 ${
                      isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                    }`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <div className="text-3xl mb-2">
                      {['👥', '🔔', '📋', '📧'][idx]}
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{feature}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={slide.ctaLink}
                className={`inline-block bg-gradient-to-r ${slide.gradient} text-white px-8 py-3 text-sm font-bold tracking-wide uppercase hover:shadow-2xl hover:scale-110 transition-all duration-300 shadow-xl rounded-full`}
              >
                {slide.ctaText}
              </Link>
            </div>
          </div>
        )}

        {/* Layout: Full (Slide 4 - AI Design) */}
        {slide.layout === 'full' && (
          <div className="relative">
            <div className={`text-center transform transition-all duration-500 ${
              isAnimating ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
            }`}>
              {/* Floating Emoji with Glow */}
              <div className="relative inline-block mb-4">
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} blur-3xl opacity-60 animate-pulse`} />
                <div className="relative text-7xl animate-float-slow">
                  {slide.emoji}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-4xl lg:text-5xl font-black mb-3 leading-tight">
                <span className={`bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}>
                  {slide.title}
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-2xl text-gray-800 mb-2 font-medium">
                {slide.highlight}
              </p>

              <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
                {slide.subtitle}
              </p>

              {/* Flowing Feature Cards */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {slide.features?.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`bg-white/70 backdrop-blur-md rounded-2xl px-5 py-2 shadow-xl border-2 transform transition-all duration-500 hover:scale-105 ${
                      isAnimating ? 'opacity-0 rotate-12' : 'opacity-100 rotate-0'
                    }`}
                    style={{
                      transitionDelay: `${idx * 150}ms`,
                      borderColor: ['#8b5cf6', '#a855f7', '#c026d3', '#d946ef'][idx]
                    }}
                  >
                    <p className={`text-base font-bold bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}>
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              {/* Dual CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  href={slide.ctaLink}
                  className={`bg-gradient-to-r ${slide.gradient} text-white px-8 py-3 text-sm font-bold tracking-wide uppercase hover:shadow-2xl hover:scale-110 transition-all duration-300 shadow-xl rounded-full`}
                >
                  {slide.ctaText}
                </Link>
                <Link
                  href="/templates"
                  className="bg-white/80 backdrop-blur-sm text-gray-800 px-8 py-3 text-sm font-bold tracking-wide uppercase hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg rounded-full border-2 border-gray-300"
                >
                  VIEW GALLERY
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Layout: Magical (Slide 5 - Envelope Animation) */}
        {slide.layout === 'magical' && (
          <div className="relative">
            <div className={`text-center transform transition-all duration-500 ${
              isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
              {/* Title */}
              <h2 className="text-5xl lg:text-6xl font-serif font-light mb-3 text-gray-900 tracking-wide">
                {slide.title}
              </h2>

              {/* Subtitle with glow */}
              <p className="text-xl text-gray-700 mb-2 font-light italic">
                {slide.highlight}
              </p>

              <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto">
                {slide.subtitle}
              </p>

              {/* Envelope Animation Container */}
              <div className="relative w-full max-w-md mx-auto mb-8" style={{ height: '280px' }}>
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-float-particle"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 8}s`,
                        animationDuration: `${8 + Math.random() * 4}s`,
                      }}
                    >
                      <div className="text-2xl opacity-40">
                        {['✨', '🌹', '💫', '🎀'][i % 4]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Envelope with opening animation */}
                <div className="envelope-container">
                  {/* Wax seal */}
                  <div className="wax-seal">
                    <div className="seal-inner">
                      💌
                    </div>
                  </div>

                  {/* Envelope body */}
                  <div className="envelope-body">
                    {/* Envelope flap */}
                    <div className="envelope-flap"></div>

                    {/* Invitation card sliding out */}
                    <div className="invitation-card">
                      <div className="card-content">
                        <div className="card-flourish">✨</div>
                        <div className="card-text">You're Invited</div>
                        <div className="card-names">Sarah & James</div>
                        <div className="card-date">June 15, 2026</div>
                        <div className="card-bloom">🌸</div>
                      </div>
                    </div>
                  </div>

                  {/* Phone mockup reveal */}
                  <div className="phone-reveal">
                    <div className="phone-screen">
                      <div className="phone-content">
                        <div className="screen-text">✨ Digital Magic ✨</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature badges - elegant floating pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {slide.features?.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg border border-amber-200/50 transform transition-all duration-700 hover:scale-105 ${
                      isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                    }`}
                    style={{
                      transitionDelay: `${idx * 200}ms`,
                      boxShadow: '0 4px 20px rgba(251, 191, 36, 0.15)'
                    }}
                  >
                    <p className="text-sm font-medium bg-gradient-to-r from-amber-700 via-yellow-600 to-rose-600 bg-clip-text text-transparent">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={slide.ctaLink}
                className={`inline-block bg-gradient-to-r ${slide.gradient} text-amber-900 px-8 py-3 text-sm font-bold tracking-wider uppercase hover:shadow-2xl hover:scale-110 transition-all duration-300 shadow-xl rounded-full border-2 border-amber-300/50`}
              >
                {slide.ctaText}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? `w-12 h-3 bg-gradient-to-r ${slide.gradient}`
                : 'w-3 h-3 bg-white/70 hover:bg-white'
            } disabled:cursor-not-allowed`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          50% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0.6;
          }
          90% {
            opacity: 0.4;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes card-sparkle {
          0%, 100% {
            opacity: 0;
            transform: translateY(0) scale(0.5);
          }
          20% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1);
          }
          80% {
            opacity: 0.6;
          }
        }

        .animate-card-sparkle {
          animation: card-sparkle ease-in-out infinite;
        }

        @keyframes text-gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fly-envelope {
          0% {
            transform: translateX(0) translateY(0) rotate(-10deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(120vw) translateY(-50px) rotate(10deg);
            opacity: 0;
          }
        }

        @keyframes fly-plane {
          0% {
            transform: translateX(0) translateY(0) rotate(45deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(120vw) translateY(-100px) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes flip-card {
          0% {
            transform: translateY(0) rotateY(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          50% {
            transform: translateY(50vh) rotateY(180deg);
            opacity: 0.6;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(120vh) rotateY(360deg);
            opacity: 0;
          }
        }

        @keyframes heart-float {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            transform: translateY(-60vh) translateX(20px) scale(1.2);
            opacity: 0.6;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-120vh) translateX(-20px) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes ribbon-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          50% {
            transform: translateY(60vh) rotate(180deg);
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(120vh) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }

        .animate-text-gradient {
          animation: text-gradient 3s ease infinite;
          background-size: 300% 300%;
        }

        .animate-fly-envelope {
          animation: fly-envelope linear infinite;
        }

        .animate-fly-plane {
          animation: fly-plane linear infinite;
        }

        .animate-flip-card {
          animation: flip-card linear infinite;
        }

        .animate-heart-float {
          animation: heart-float ease-in-out infinite;
        }

        .animate-ribbon-fall {
          animation: ribbon-fall linear infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .bg-300\% {
          background-size: 300%;
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }

        /* Magical Envelope Animations */
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) translateX(15px) rotate(180deg);
            opacity: 0.6;
          }
        }

        .animate-float-particle {
          animation: float-particle ease-in-out infinite;
        }

        /* Envelope Container */
        .envelope-container {
          position: relative;
          width: 280px;
          height: 180px;
          margin: 0 auto;
          perspective: 1000px;
        }

        /* Wax Seal */
        .wax-seal {
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          border-radius: 50%;
          z-index: 15;
          animation: seal-pulse 10s ease-in-out infinite;
          box-shadow: 0 4px 15px rgba(217, 119, 6, 0.4);
        }

        .seal-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-size: 24px;
          animation: seal-glow 10s ease-in-out infinite;
        }

        @keyframes seal-pulse {
          0%, 20%, 100% {
            transform: translateX(-50%) scale(1);
          }
          25% {
            transform: translateX(-50%) scale(0.95);
          }
          30% {
            transform: translateX(-50%) scale(1.05);
          }
        }

        @keyframes seal-glow {
          0%, 20%, 100% {
            filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.5));
          }
          25%, 35% {
            filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.8));
          }
        }

        /* Envelope Body */
        .envelope-body {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 280px;
          height: 180px;
          background: linear-gradient(145deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%);
          border-radius: 8px;
          box-shadow:
            0 10px 40px rgba(0, 0, 0, 0.15),
            inset 0 2px 0 rgba(255, 255, 255, 0.3);
          animation: envelope-float 10s ease-in-out infinite;
          z-index: 10;
        }

        @keyframes envelope-float {
          0%, 100% {
            transform: translate(-50%, -50%) rotateY(0deg) rotateX(0deg);
          }
          20% {
            transform: translate(-50%, -50%) rotateY(3deg) rotateX(2deg);
          }
          40% {
            transform: translate(-50%, -50%) rotateY(-3deg) rotateX(-2deg);
          }
          60% {
            transform: translate(-50%, -50%) rotateY(2deg) rotateX(1deg);
          }
          80% {
            transform: translate(-50%, -50%) rotateY(-2deg) rotateX(-1deg);
          }
        }

        /* Envelope Flap */
        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-left: 140px solid transparent;
          border-right: 140px solid transparent;
          border-top: 90px solid #f59e0b;
          transform-origin: top center;
          animation: flap-open 10s ease-in-out infinite;
          z-index: 11;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        @keyframes flap-open {
          0%, 20% {
            transform: rotateX(0deg);
          }
          25%, 40% {
            transform: rotateX(-180deg);
          }
          90%, 100% {
            transform: rotateX(0deg);
          }
        }

        /* Invitation Card */
        .invitation-card {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 280px;
          background: linear-gradient(135deg, #ffffff 0%, #fef3c7 100%);
          border-radius: 8px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          animation: card-slide 10s ease-in-out infinite;
          z-index: 12;
        }

        @keyframes card-slide {
          0%, 25% {
            transform: translateX(-50%) translateY(0) scale(0.8);
            opacity: 0;
          }
          30%, 55% {
            transform: translateX(-50%) translateY(-80px) scale(1);
            opacity: 1;
          }
          60%, 100% {
            transform: translateX(-50%) translateY(0) scale(0.8);
            opacity: 0;
          }
        }

        /* Card Content */
        .card-content {
          padding: 30px 20px;
          text-align: center;
          font-family: Georgia, serif;
        }

        .card-flourish {
          font-size: 32px;
          margin-bottom: 15px;
          animation: flourish-appear 10s ease-in-out infinite;
        }

        .card-text {
          font-size: 14px;
          font-style: italic;
          color: #78716c;
          margin-bottom: 20px;
          animation: text-fade 10s ease-in-out infinite;
        }

        .card-names {
          font-size: 22px;
          font-weight: bold;
          background: linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
          animation: names-pulse 10s ease-in-out infinite;
        }

        .card-date {
          font-size: 13px;
          color: #a8a29e;
          animation: text-fade 10s ease-in-out infinite;
        }

        .card-bloom {
          font-size: 24px;
          margin-top: 20px;
          animation: bloom-grow 10s ease-in-out infinite;
        }

        @keyframes flourish-appear {
          0%, 30% { opacity: 0; transform: scale(0.5) rotate(-180deg); }
          35%, 55% { opacity: 1; transform: scale(1) rotate(0deg); }
          60%, 100% { opacity: 0; }
        }

        @keyframes text-fade {
          0%, 32% { opacity: 0; transform: translateY(10px); }
          37%, 55% { opacity: 1; transform: translateY(0); }
          60%, 100% { opacity: 0; }
        }

        @keyframes names-pulse {
          0%, 35% { opacity: 0; transform: scale(0.9); }
          40%, 55% { opacity: 1; transform: scale(1); }
          42%, 44%, 46% { transform: scale(1.05); }
          60%, 100% { opacity: 0; }
        }

        @keyframes bloom-grow {
          0%, 38% { opacity: 0; transform: scale(0); }
          43%, 55% { opacity: 1; transform: scale(1) rotate(360deg); }
          60%, 100% { opacity: 0; }
        }

        /* Phone Reveal */
        .phone-reveal {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 180px;
          height: 360px;
          animation: phone-appear 10s ease-in-out infinite;
          z-index: 13;
        }

        @keyframes phone-appear {
          0%, 60% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5) rotateY(-90deg);
          }
          65%, 90% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotateY(0deg);
          }
          95%, 100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9) rotateY(0deg);
          }
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          border-radius: 28px;
          padding: 12px;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.4),
            0 0 0 6px rgba(255, 255, 255, 0.1),
            inset 0 0 20px rgba(255, 255, 255, 0.05);
          position: relative;
        }

        .phone-screen::before {
          content: '';
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 6px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
        }

        .phone-content {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          animation: screen-glow 10s ease-in-out infinite;
        }

        @keyframes screen-glow {
          0%, 65% { box-shadow: inset 0 0 30px rgba(251, 191, 36, 0); }
          70%, 85% { box-shadow: inset 0 0 30px rgba(251, 191, 36, 0.5); }
          90%, 100% { box-shadow: inset 0 0 30px rgba(251, 191, 36, 0); }
        }

        .screen-text {
          font-size: 16px;
          font-weight: bold;
          background: linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: screen-text-appear 10s ease-in-out infinite;
        }

        @keyframes screen-text-appear {
          0%, 68% { opacity: 0; transform: scale(0.8); }
          73%, 90% { opacity: 1; transform: scale(1); }
          95%, 100% { opacity: 0; }
        }

        /* Slide 2 Envelope Animations */
        .envelope2-container {
          position: relative;
          width: 100%;
          max-width: 320px;
          height: 280px;
          margin: 0 auto;
          perspective: 1000px;
        }

        .envelope2-body {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 200px;
          background: linear-gradient(145deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%);
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(236, 72, 153, 0.2);
          animation: envelope2-float 8s ease-in-out infinite;
          z-index: 10;
        }

        @keyframes envelope2-float {
          0%, 100% {
            transform: translate(-50%, -50%) rotateY(0deg) scale(1);
          }
          25% {
            transform: translate(-50%, -50%) rotateY(5deg) scale(1.02);
          }
          50% {
            transform: translate(-50%, -50%) rotateY(-5deg) scale(1);
          }
          75% {
            transform: translate(-50%, -50%) rotateY(3deg) scale(1.02);
          }
        }

        .envelope2-flap {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-left: 150px solid transparent;
          border-right: 150px solid transparent;
          border-top: 100px solid #ec4899;
          transform-origin: top center;
          animation: flap2-open 8s ease-in-out infinite;
          z-index: 11;
          filter: drop-shadow(0 4px 10px rgba(236, 72, 153, 0.3));
        }

        @keyframes flap2-open {
          0%, 15% {
            transform: rotateX(0deg);
          }
          20%, 85% {
            transform: rotateX(-180deg);
          }
          90%, 100% {
            transform: rotateX(0deg);
          }
        }

        .welcome-card {
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 240px;
          height: 300px;
          background: #fffef9;
          border-radius: 4px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          animation: welcome-slide 8s ease-in-out infinite;
          z-index: 12;
        }

        @keyframes welcome-slide {
          0%, 20% {
            transform: translateX(-50%) translateY(0) scale(0.85);
            opacity: 0;
          }
          25%, 80% {
            transform: translateX(-50%) translateY(-90px) scale(1);
            opacity: 1;
          }
          85%, 100% {
            transform: translateX(-50%) translateY(0) scale(0.85);
            opacity: 0;
          }
        }

        .welcome-content {
          padding: 60px 20px;
          text-align: center;
          font-family: Georgia, serif;
        }

        .welcome-title {
          font-size: 20px;
          font-weight: bold;
          background: linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 15px;
          animation: title-appear 8s ease-in-out infinite;
        }

        .welcome-divider {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ec4899, transparent);
          margin: 0 auto 15px;
          animation: divider-expand 8s ease-in-out infinite;
        }

        @keyframes divider-expand {
          0%, 30% { width: 0; opacity: 0; }
          35%, 80% { width: 60px; opacity: 1; }
          85%, 100% { opacity: 0; }
        }

        .welcome-message {
          font-size: 18px;
          font-style: italic;
          color: #9f1239;
          margin-bottom: 20px;
          animation: message-fade 8s ease-in-out infinite;
        }

        .welcome-hearts {
          font-size: 32px;
          animation: hearts-float 8s ease-in-out infinite;
        }

        @keyframes title-appear {
          0%, 25% { opacity: 0; transform: translateY(10px); }
          30%, 80% { opacity: 1; transform: translateY(0); }
          85%, 100% { opacity: 0; }
        }

        @keyframes message-fade {
          0%, 30% { opacity: 0; transform: translateY(10px); }
          35%, 80% { opacity: 1; transform: translateY(0); }
          85%, 100% { opacity: 0; }
        }

        @keyframes hearts-float {
          0%, 35% { opacity: 0; transform: translateY(10px) scale(0.5); }
          40%, 80% { opacity: 1; transform: translateY(0) scale(1); }
          42%, 44%, 46% { transform: translateY(-5px) scale(1.1); }
          85%, 100% { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
