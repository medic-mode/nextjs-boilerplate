"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GoogleAnalytics({ gaId }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', gaId, {
        page_path: pathname,
      });
    }
  }, [pathname, gaId]);

  return null;
}
