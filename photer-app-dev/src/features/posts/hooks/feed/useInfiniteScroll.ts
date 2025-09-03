import { RefObject, useEffect } from 'react';

type Props = {
  callback: () => void;
  hasMore?: boolean;
  triggerRef: RefObject<HTMLDivElement | null>;
};

export const useInfiniteScroll = ({
  triggerRef,
  callback,
  hasMore,
}: Props): void => {
  useEffect(() => {
    if (!hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 1 }
    );

    const loader = triggerRef ? triggerRef.current : null;
    if (loader) {
      observer.observe(loader);
    }

    return (): void => {
      if (loader) {
        observer.unobserve(loader);
      }
    };
  }, [hasMore, callback, triggerRef]);
};
