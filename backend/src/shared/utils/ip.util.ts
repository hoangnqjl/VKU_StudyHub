import { Request } from 'express';

/**
 * Helper to safely extract client IP address from Express Request
 * Handles proxy headers (X-Forwarded-For), IPv6 loopback (::1, ::ffff:), and remote addresses.
 */
export const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];

  let ip = '';
  if (typeof forwarded === 'string') {
    // In case of multiple proxies, the client's original IP is the first item
    ip = forwarded.split(',')[0].trim();
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    ip = forwarded[0].trim();
  } else {
    ip = req.socket.remoteAddress || req.ip || '127.0.0.1';
  }

  // Normalize IPv6 localhost or mapped IPv4
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    return '127.0.0.1';
  }

  // Strip ::ffff: prefix if present in standard IPv4
  if (ip.startsWith('::ffff:')) {
    return ip.replace('::ffff:', '');
  }

  return ip;
};
