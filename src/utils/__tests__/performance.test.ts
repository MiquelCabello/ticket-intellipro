import { describe, it, expect, beforeEach, vi } from 'vitest';
import { performanceMonitor } from '../performance';

// Mock performance API
const mockPerformance = {
  getEntriesByType: vi.fn(),
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
});

describe('Performance utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceMonitor.clearMetrics();
  });

  describe('recordMetric', () => {
    it('should record a custom metric', () => {
      performanceMonitor.recordMetric('custom_action', 150);
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].name).toBe('custom_action');
      expect(metrics[0].value).toBe(150);
    });
  });

  describe('recordPageLoad', () => {
    it('should handle missing performance API gracefully', () => {
      Object.defineProperty(window, 'performance', {
        value: undefined,
        writable: true,
      });

      expect(() => {
        performanceMonitor.recordPageLoad();
      }).not.toThrow();
    });

    it('should record page load metrics when available', () => {
      const mockNavigation = {
        fetchStart: 1000,
        domContentLoadedEventStart: 1100,
        domContentLoadedEventEnd: 1150,
        loadEventStart: 1200,
        loadEventEnd: 1250,
        responseStart: 1050,
        domInteractive: 1120,
      };

      mockPerformance.getEntriesByType.mockReturnValue([mockNavigation]);

      performanceMonitor.recordPageLoad();
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics.length).toBeGreaterThan(0);
    });
  });
});