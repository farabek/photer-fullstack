export const decodeJwt = (
  token: string
): {
  userId?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  [k: string]: any;
} => {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(
      payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
    );
    return JSON.parse(payloadJson);
  } catch (error) {
    console.log('Failed to decode JWT:', error);
    return {};
  }
};
