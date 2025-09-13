/**
 * Performance monitoring utilities
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private isDevelopment = import.meta.env.DEV;

  /**
   * Record page load performance
   */
  recordPageLoad(): void {
    if (!window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    const metrics = {
      // Core Web Vitals and key metrics
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalPageLoad: navigation.loadEventEnd - navigation.fetchStart,
      firstByte: navigation.responseStart - navigation.fetchStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
    };

    // Record each metric
    Object.entries(metrics).forEach(([name, value]) => {
      if (value > 0) {
        this.recordMetric(name, value);
      }
    });

    // Calculate and log p95
    this.calculateP95();
  }

  /**
   * Record custom performance metric
   */
  recordMetric(name: string, value: number): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.metrics.push(metric);

    if (this.isDevelopment) {
      console.log(`[PERF] ${name}: ${value.toFixed(2)}ms`);
    }

    // Send to monitoring service in production
    this.sendToMonitoring(metric);
  }

  /**
   * Calculate p95 for page load metrics
   */
  private calculateP95(): void {
    const pageLoadMetrics = this.metrics
      .filter(m => m.name === 'totalPageLoad')
      .map(m => m.value)
      .sort((a, b) => a - b);

    if (pageLoadMetrics.length === 0) return;

    const p95Index = Math.ceil(pageLoadMetrics.length * 0.95) - 1;
    const p95Value = pageLoadMetrics[p95Index];

    if (this.isDevelopment) {
      console.log(`[PERF] P95 Page Load: ${p95Value.toFixed(2)}ms`);
    }

    // Record p95 as a metric
    this.recordMetric('p95_page_load', p95Value);
  }

  /**
   * Send metric to monitoring service
   */
  private sendToMonitoring(metric: PerformanceMetric): void {
    // TODO: Implement actual monitoring service integration
    // For now, just store locally in development
    if (this.isDevelopment) {
      const stored = localStorage.getItem('performance_metrics');
      const existing = stored ? JSON.parse(stored) : [];
      existing.push(metric);
      
      // Keep only last 100 metrics
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100);
      }
      
      localStorage.setItem('performance_metrics', JSON.stringify(existing));
    }
  }

  /**
   * Get stored metrics for analysis
   */
  getMetrics(): PerformanceMetric[] {
    if (this.isDevelopment) {
      const stored = localStorage.getItem('performance_metrics');
      return stored ? JSON.parse(stored) : [];
    }
    return this.metrics;
  }

  /**
   * Clear stored metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    if (this.isDevelopment) {
      localStorage.removeItem('performance_metrics');
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// For non-React usage - initialize on page load
export function initPerformanceTracking() {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        performanceMonitor.recordPageLoad();
      }, 100);
    });
  }
}
