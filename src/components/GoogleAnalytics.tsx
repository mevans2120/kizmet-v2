'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useCallback } from 'react';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const trackPageView = useCallback(() => {
    if (!measurementId || !window.gtag) return;
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    window.gtag('config', measurementId, { page_path: url });
  }, [pathname, searchParams, measurementId]);

  // Track route changes for SPA navigation, deferred until browser is idle
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(trackPageView);
    } else {
      setTimeout(trackPageView, 1);
    }
  }, [trackPageView]);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// TypeScript declarations for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}
