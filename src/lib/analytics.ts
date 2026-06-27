// Google Analytics 4 configuration and tracking functions

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_TRACKING_ID) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', GA_TRACKING_ID, {
    page_path: window.location.pathname,
    send_page_view: false, // We'll send manually
  })
}

// Page view tracking
export const pageview = (url: string) => {
  if (typeof window === 'undefined' || !GA_TRACKING_ID) return

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

// Event tracking
interface EventParams {
  action: string
  category: string
  label?: string
  value?: number
}

export const event = ({ action, category, label, value }: EventParams) => {
  if (typeof window === 'undefined' || !GA_TRACKING_ID) return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Custom event tracking helpers

// Event creation tracking
export const trackEventCreated = (eventType: string) => {
  event({
    action: 'create_event',
    category: 'Events',
    label: eventType,
  })
}

// Template selection tracking
export const trackTemplateSelected = (templateId: string, isPremium: boolean) => {
  event({
    action: 'select_template',
    category: 'Templates',
    label: templateId,
    value: isPremium ? 1 : 0,
  })
}

// Invitation sending tracking
export const trackInvitationSent = (method: 'email' | 'sms' | 'link', count: number) => {
  event({
    action: 'send_invitation',
    category: 'Invitations',
    label: method,
    value: count,
  })
}

// RSVP tracking
export const trackRSVP = (status: 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE') => {
  event({
    action: 'submit_rsvp',
    category: 'RSVP',
    label: status,
  })
}

// Subscription tracking
export const trackSubscription = (tier: 'FREE' | 'PRO' | 'BUSINESS', action: 'upgrade' | 'downgrade' | 'cancel') => {
  event({
    action: action,
    category: 'Subscriptions',
    label: tier,
  })
}

// Payment tracking
export const trackPurchase = (type: 'coins' | 'subscription', value: number) => {
  event({
    action: 'purchase',
    category: 'Payments',
    label: type,
    value: value,
  })
}

// Feature usage tracking
export const trackFeatureUsage = (feature: string) => {
  event({
    action: 'use_feature',
    category: 'Features',
    label: feature,
  })
}

// Error tracking
export const trackError = (error: string, fatal: boolean = false) => {
  event({
    action: 'exception',
    category: 'Errors',
    label: error,
    value: fatal ? 1 : 0,
  })
}

// User signup tracking
export const trackSignup = (method: 'email' | 'google') => {
  event({
    action: 'sign_up',
    category: 'Auth',
    label: method,
  })
}

// User login tracking
export const trackLogin = (method: 'email' | 'google') => {
  event({
    action: 'login',
    category: 'Auth',
    label: method,
  })
}

// Search tracking
export const trackSearch = (query: string, resultCount: number) => {
  event({
    action: 'search',
    category: 'Search',
    label: query,
    value: resultCount,
  })
}

// Social share tracking
export const trackShare = (platform: string, eventId: string) => {
  event({
    action: 'share',
    category: 'Social',
    label: platform,
  })
}

// File upload tracking
export const trackFileUpload = (fileType: string, fileSize: number) => {
  event({
    action: 'upload_file',
    category: 'Files',
    label: fileType,
    value: Math.round(fileSize / 1024), // KB
  })
}

// Performance tracking
export const trackPerformance = (metric: string, value: number) => {
  event({
    action: 'performance',
    category: 'Performance',
    label: metric,
    value: Math.round(value),
  })
}

// Export tracking
export const trackExport = (type: 'csv' | 'pdf', dataType: string) => {
  event({
    action: 'export',
    category: 'Export',
    label: `${type}_${dataType}`,
  })
}

// Feedback tracking
export const trackFeedback = (type: 'bug' | 'feature' | 'general' | 'love') => {
  event({
    action: 'submit_feedback',
    category: 'Feedback',
    label: type,
  })
}
