import Link from 'next/link';
import { Button } from '@/shared/ui';

type SignUpPromptProps = {
  promptText: string;
  buttonText: string;
  href: string;
};

export function SignUpPrompt({
  promptText,
  buttonText,
  href,
}: SignUpPromptProps): React.ReactElement {
  return (
    <>
      <p className="text-light-100 regular-text-16 text-center">{promptText}</p>
      <Button variant="text" asChild className="w-full">
        <Link href={href}>{buttonText}</Link>
      </Button>
    </>
  );
}
