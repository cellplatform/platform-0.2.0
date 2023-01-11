import { useEffect, useState } from 'react';

/**
 * State that monitors the environments online/offline status.
 */
export function useOfflineState() {
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleChanged = (e: Event) => setOnline(navigator.onLine);
    window.addEventListener('online', handleChanged);
    window.addEventListener('offline', handleChanged);

    return () => {
      window.removeEventListener('online', handleChanged);
      window.removeEventListener('offline', handleChanged);
    };
  }, []);

  return { online, offline: !online };
}
