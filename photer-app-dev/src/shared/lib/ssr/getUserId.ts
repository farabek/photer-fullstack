// src/shared/lib/ssr/getUserId.ts

import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Функция для обновления access token используя refresh token
const refreshAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    console.log('refreshAccessToken: No refresh token found');
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store',
      }
    );

    console.log('refreshAccessToken RESPONSE:', {
      status: response.status,
      ok: response.ok,
      timestamp: new Date().toISOString(),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('refreshAccessToken SUCCESS:', {
        hasAccessToken: !!data.accessToken,
        accessTokenLength: data.accessToken?.length || 0,
        timestamp: new Date().toISOString(),
      });
      return data.accessToken;
    } else {
      console.log('refreshAccessToken FAILED:', {
        status: response.status,
        statusText: response.statusText,
      });
      return null;
    }
  } catch (error) {
    console.error('refreshAccessToken ERROR:', error);
    return null;
  }
};

// Функция для получения действительного access token
export const getValidAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('accessToken')?.value;

  // Если нет accessToken, попробуем его обновить
  if (!accessToken) {
    console.log('getValidAccessToken: No access token found, trying to refresh...');
    accessToken = await refreshAccessToken();

    if (!accessToken) {
      console.log('getValidAccessToken: Failed to refresh access token');
      return null;
    }

    console.log('getValidAccessToken: Successfully refreshed access token');
  }

  return accessToken;
};

// Функция для проверки авторизации пользователя через API
export const isUserAuthorized = async (): Promise<boolean> => {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    console.log('isUserAuthorized: No valid access token available');
    return false;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/me`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    const isAuthorized = response.ok;
    console.log('isUserAuthorized CHECK:', {
      accessTokenPresent: !!accessToken,
      responseStatus: response.status,
      responseOk: response.ok,
      isAuthorized,
      timestamp: new Date().toISOString(),
    });

    return isAuthorized;
  } catch (error) {
    console.error('isUserAuthorized ERROR:', error);
    return false;
  }
};

export const getUserId = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const accessToken = cookieStore.get('accessToken')?.value;

  console.log('getUserId DEBUG:', {
    hasRefreshToken: !!refreshToken,
    hasAccessToken: !!accessToken,
    refreshTokenLength: refreshToken?.length || 0,
    accessTokenLength: accessToken?.length || 0,
    timestamp: new Date().toISOString(),
  });

  if (refreshToken) {
    try {
      const decoded = jwt.decode(refreshToken) as JwtPayload;
      const userId = decoded?.sub || null;
      console.log('getUserId DECODED:', {
        userId,
        decoded,
        exp: decoded?.exp,
        iat: decoded?.iat,
        isExpired: decoded?.exp ? decoded.exp < Date.now() / 1000 : false,
        timestamp: new Date().toISOString(),
      });
      // В JWT payload userId хранится в поле 'sub' (как в AuthService)
      return userId;
    } catch (error) {
      console.error('Error decoding refresh token:', error);
      return null;
    }
  }
  console.log('getUserId: No refresh token found');
  return null;
};
