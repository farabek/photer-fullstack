'use client';
import React, { ReactElement, useLayoutEffect, useRef, useState } from 'react';
import { Button, Scrollbar } from '@/shared/ui';

function getCharWidth(char: string, font = '16px Arial'): number {
  const span = document.createElement('span');
  span.style.position = 'absolute';
  span.style.whiteSpace = 'pre';
  span.style.visibility = 'hidden';
  span.style.font = font;
  span.textContent = char;
  document.body.appendChild(span);

  const width = span.getBoundingClientRect().width;
  span.remove();
  return width;
}

export const NewDescription = ({ text }: { text: string }): ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [lineClamp, setLineClamp] = useState<number | undefined>(undefined);
  const [isShowMore, setIsShowMore] = useState(false);

  const handleClick = (): void => {
    setIsShowMore(!isShowMore);
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const computedStyle = window.getComputedStyle(container);
    const lineHeight = parseFloat(computedStyle.lineHeight);

    const width = getCharWidth(text, computedStyle.font);
    const charWidth = width / text.length;

    const availableHeight = container.clientHeight;
    const oneStringWidth = container.clientWidth;
    const maxLines = Math.floor(availableHeight / lineHeight);
    const maxChars = Math.floor((oneStringWidth * maxLines) / charWidth);

    if (maxLines > 0 && text.length > maxChars) {
      setLineClamp(maxChars);
    }
  }, [text]);

  const visibleDescription = text.slice(0, isShowMore ? undefined : lineClamp);
  const isLongDescription = lineClamp && text.length > lineClamp;

  return (
    <Scrollbar ref={containerRef}>
      <div className="regular-text-14 h-full w-full overflow-hidden">
        <span className="break-all" ref={textRef}>
          {visibleDescription}
          {isLongDescription && !isShowMore && '...'}
        </span>
        {isLongDescription && (
          <Button
            variant="text"
            className="regular-text-14 ml-1 h-min cursor-pointer border-none p-0 underline underline-offset-2"
            onClick={handleClick}
          >
            {isShowMore ? 'Hide' : 'Show more'}
          </Button>
        )}
      </div>
    </Scrollbar>
  );
};
