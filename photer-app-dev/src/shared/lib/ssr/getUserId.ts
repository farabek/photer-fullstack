// src/shared/lib/ssr/getUserId.ts

import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const getUserId = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (refreshToken) {
    try {
      const decoded = jwt.decode(refreshToken) as JwtPayload;
      // В JWT payload userId хранится в поле 'sub' (как в AuthService)
      return decoded?.sub || null;
    } catch (error) {
      console.error('Error decoding refresh token:', error);
      return null;
    }
  }
  return null;
};
