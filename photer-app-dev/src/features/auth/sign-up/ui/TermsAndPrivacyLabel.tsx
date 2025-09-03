import React from 'react';
import Link from 'next/link';

export function TermsAndPrivacyLabel(): React.ReactElement {
  return (
    <span className="small-text">
      I agree to the{' '}
      <Link href="/terms-of-service" className="text-accent-300 underline">
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link href="/privacy-policy" className="text-accent-300 underline">
        Privacy Policy
      </Link>
    </span>
  );
}
