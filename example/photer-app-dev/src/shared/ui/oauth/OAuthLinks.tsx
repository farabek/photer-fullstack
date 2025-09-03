import { ReactElement } from 'react';
import Link from 'next/link';
import { IconSprite } from '../icon/IconSprite';

export function OAuthLinks(): ReactElement {
  return (
    <div className="mt-[13px] flex justify-center gap-[60px]">
      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/oauth/google/login`}
      >
        <IconSprite
          iconName="google"
          width="36"
          className="mx-auto fill-white"
          height="36"
        />
      </Link>
      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/oauth/github/login`}
      >
        <IconSprite
          iconName="github"
          width="36"
          className="mx-auto fill-white"
          height="36"
        />
      </Link>
    </div>
  );
}
