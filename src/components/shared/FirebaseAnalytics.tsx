
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { appInitializedSuccessfully, analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

function FirebaseAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // This effect runs on the client after hydration, and re-runs on path changes.
    // It ensures Analytics is initialized and logs page views.
    if (appInitializedSuccessfully && analytics) {
      const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      logEvent(analytics, 'page_view', {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  // This component does not render anything to the DOM.
  return null;
}

export default FirebaseAnalytics;
