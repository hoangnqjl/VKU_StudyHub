import { useState, useEffect } from 'react';
import { radarService } from '../services';

export function useNotificationBadge() {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    let mounted = true;

    const checkBadge = async () => {
      try {
        const res = await radarService.getBadgeCount();
        if (mounted && res && typeof res.pendingCount === 'number') {
          setUnreadCount(res.pendingCount);
        }
      } catch {
        if (mounted) setUnreadCount(0);
      }
    };

    checkBadge();
    const timer = setInterval(checkBadge, 15000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return unreadCount;
}

