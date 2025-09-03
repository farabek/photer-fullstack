'use client';
import { useCallback, useEffect } from 'react';

const reCaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

export const useRecaptcha = (): {
  executeRecaptchaToken: (action: string) => Promise<string | undefined>;
} => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${reCaptchaSiteKey}`;
    script.async = true;
    document.body.appendChild(script);

    return (): void => {
      script.remove();

      const nodeBadges = document.querySelectorAll('.grecaptcha-badge');
      nodeBadges.forEach((nodeBadge) => {
        if (nodeBadge && nodeBadge.parentNode) {
          document.body.removeChild(nodeBadge.parentNode);
        }
      });
    };
  }, []);

  const executeRecaptchaToken = useCallback(async (action: string) => {
    if (window.grecaptcha) {
      return await window.grecaptcha.execute(reCaptchaSiteKey, { action });
    }
  }, []);

  return { executeRecaptchaToken };
};
