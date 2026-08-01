import { SignJWT, jwtVerify } from 'jose';

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: Record<string, any>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] });
    return payload;
  } catch {
    return null;
  }
}

export async function signTempToken(payload: Record<string, any>, expiresIn = '10m'): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function verifyTempToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export async function signOauthState(payload: Record<string, any>): Promise<string> {
  return signTempToken(payload, '10m');
}

export async function verifyOauthState(token: string): Promise<any> {
  return verifyTempToken(token);
}
