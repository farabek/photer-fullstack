import { PhotoNavigation } from './PhotoNavigation';
import Image from 'next/image';

type PhotoPreviewWithNavProps = {
  url: string | undefined;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  filterClass?: string;
};

export function PhotoPreviewWithNav({
  url,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  filterClass,
}: PhotoPreviewWithNavProps): React.ReactElement {
  return (
    <div className="relative flex h-[400px] w-full items-center justify-center rounded-lg bg-black">
      <Image
        src={url || '/placeholder.svg'}
        alt="Preview"
        className={`max-h-full max-w-full object-contain ${filterClass}`}
        fill
        unoptimized
      />
      <PhotoNavigation
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
}
