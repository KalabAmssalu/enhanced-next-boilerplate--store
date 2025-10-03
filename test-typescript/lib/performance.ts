import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track Core Web Vitals
  trackWebVitals() {
    if (typeof window === "undefined") return;

    getCLS((metric) => this.handleMetric("CLS", metric));
    getFID((metric) => this.handleMetric("FID", metric));
    getFCP((metric) => this.handleMetric("FCP", metric));
    getLCP((metric) => this.handleMetric("LCP", metric));
    getTTFB((metric) => this.handleMetric("TTFB", metric));
  }

  private handleMetric(name: string, metric: any) {
    this.metrics.set(name, metric.value);

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${name}:`, metric.value);
    }

    // Send to analytics
    this.sendToAnalytics(name, metric);
  }

  private sendToAnalytics(name: string, metric: any) {
    // Send to Google Analytics
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as any).gtag("event", name, {
        event_category: "Web Vitals",
        value: Math.round(name === "CLS" ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Send to custom analytics
    if (typeof window !== "undefined" && "analytics" in window) {
      (window as any).analytics.track("performance_metric", {
        metric: name,
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
      });
    }
  }

  // Track custom performance metrics
  trackCustomMetric(
    name: string,
    value: number,
    properties?: Record<string, any>
  ) {
    this.metrics.set(name, value);

    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${name}:`, value, properties);
    }

    if (typeof window !== "undefined" && "analytics" in window) {
      (window as any).analytics.track("custom_performance_metric", {
        metric: name,
        value,
        ...properties,
      });
    }
  }

  // Get all metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Track page load performance
  trackPageLoad() {
    if (typeof window === "undefined") return;

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      this.trackCustomMetric(
        "page_load_time",
        navigation.loadEventEnd - navigation.fetchStart
      );
      this.trackCustomMetric(
        "dom_content_loaded",
        navigation.domContentLoadedEventEnd - navigation.fetchStart
      );
      this.trackCustomMetric(
        "first_byte",
        navigation.responseStart - navigation.fetchStart
      );
    }
  }

  // Track API performance
  trackApiCall(url: string, duration: number, status: number) {
    this.trackCustomMetric("api_response_time", duration, {
      url,
      status,
    });
  }

  // Track component render performance
  trackComponentRender(componentName: string, renderTime: number) {
    this.trackCustomMetric("component_render_time", renderTime, {
      component: componentName,
    });
  }
}

// Performance optimization utilities
export const performanceUtils = {
  // Debounce function for performance
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function for performance
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Lazy load images
  lazyLoadImages() {
    if (typeof window === "undefined") return;

    const images = document.querySelectorAll("img[data-src]");
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || "";
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  },

  // Preload critical resources
  preloadResource(href: string, as: string, type?: string) {
    if (typeof document === "undefined") return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  },

  // Prefetch resources
  prefetchResource(href: string) {
    if (typeof document === "undefined") return;

    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.head.appendChild(link);
  },
};

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  const monitor = PerformanceMonitor.getInstance();
  monitor.trackWebVitals();
  monitor.trackPageLoad();
  performanceUtils.lazyLoadImages();
}

export default PerformanceMonitor;
