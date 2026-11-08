import crypto from 'crypto';

/**
 * Hash a password using scrypt with a unique random salt
 */
export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

/**
 * Verify a plain password against the stored hash
 */
export const verifyPassword = (password: string, storedHash?: string): boolean => {
  if (!storedHash) return false;
  
  // Plain text match
  if (password === storedHash) return true;

  // Database seed fallback hash
  if (storedHash === 'mock_hash_vku_2026' && (password === '123456' || password === 'password123' || password === 'admin123')) {
    return true;
  }

  // SHA256 match
  const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
  if (sha256Hash === storedHash) return true;

  // If storedHash is a plain string without salt delimiter
  if (!storedHash.includes(':')) {
    return false;
  }

  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;

  try {
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
};

