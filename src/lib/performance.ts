/**
 * Performance monitoring utilities
 */

export class PerformanceMonitor {
  private marks: Map<string, number>

  constructor() {
    this.marks = new Map()
  }

  /**
   * Start measuring
   */
  start(name: string): void {
    if (typeof window === 'undefined') return
    this.marks.set(name, performance.now())
  }

  /**
   * End measuring and log
   */
  end(name: string): number | null {
    if (typeof window === 'undefined') return null

    const startTime = this.marks.get(name)
    if (!startTime) {
      console.warn(`No start mark found for: ${name}`)
      return null
    }

    const duration = performance.now() - startTime
    this.marks.delete(name)

    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
    }

    return duration
  }

  /**
   * Measure async function
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name)
    try {
      const result = await fn()
      this.end(name)
      return result
    } catch (error) {
      this.end(name)
      throw error
    }
  }

  /**
   * Report Web Vitals
   */
  static reportWebVitals(metric: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Web Vital:', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      })
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Google Analytics
      // gtag('event', metric.name, {
      //   value: Math.round(metric.value),
      //   metric_id: metric.id,
      //   metric_value: metric.value,
      //   metric_delta: metric.delta,
      // })
    }
  }

  /**
   * Get performance metrics
   */
  static getMetrics() {
    if (typeof window === 'undefined') return null

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

    if (!navigation) return null

    return {
      // Time to First Byte
      ttfb: navigation.responseStart - navigation.requestStart,

      // DOM Content Loaded
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,

      // Load Complete
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,

      // Total Load Time
      totalLoad: navigation.loadEventEnd - navigation.fetchStart,

      // DNS Lookup
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,

      // TCP Connection
      tcp: navigation.connectEnd - navigation.connectStart,

      // Request Time
      request: navigation.responseEnd - navigation.requestStart,
    }
  }

  /**
   * Check if page is slow
   */
  static isSlowPage(): boolean {
    const metrics = this.getMetrics()
    if (!metrics) return false

    // Consider page slow if TTFB > 800ms or total load > 3000ms
    return metrics.ttfb > 800 || metrics.totalLoad > 3000
  }
}

// Singleton instance
export const perfMonitor = new PerformanceMonitor()

/**
 * Hook for measuring component render time
 */
export function usePerformance(componentName: string) {
  if (typeof window === 'undefined') return

  const renderStart = performance.now()

  return () => {
    const renderTime = performance.now() - renderStart
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(`🐌 Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`)
    }
  }
}

/**
 * Debounce utility for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle utility for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
