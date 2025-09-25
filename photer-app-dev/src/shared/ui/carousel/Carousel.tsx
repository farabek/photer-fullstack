'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { ReactNode, useId, useState, useCallback } from 'react';
import 'swiper/css';
import { cn } from '@/shared/lib/cn';
import { IconSprite } from '@/shared/ui';

type Props = {
  className?: string;
  children: ReactNode | ReactNode[];
  showIndicators?: boolean;
  enableKeyboard?: boolean;
  enableA11y?: boolean;
};

export const Carousel = ({
  children,
  className,
  showIndicators = false,
  enableKeyboard = true,
  enableA11y = true,
}: Props): ReactNode => {
  const Id = useId().replaceAll(':', '_');
  const [activeIndex, setActiveIndex] = useState(0);

  // Безопасная обработка children
  const slides = Array.isArray(children)
    ? children.filter(Boolean)
    : [children].filter(Boolean);

  // Debug logging
  console.log('=== CAROUSEL DEBUG ===', {
    carouselId: Id,
    childrenType: Array.isArray(children) ? 'array' : typeof children,
    childrenLength: Array.isArray(children) ? children.length : 1,
    slidesCount: slides.length,
    showIndicators,
    enableKeyboard,
    enableA11y,
    willShowNavigation: slides.length > 1,
    willShowPagination: slides.length > 1,
    willShowIndicator: showIndicators,
    timestamp: new Date().toISOString(),
  });

  // Если нет слайдов - возвращаем пустой div
  if (slides.length === 0) {
    console.log('=== CAROUSEL RENDER === NO SLIDES');
    return <div className={cn('w-full', className)} />;
  }

  // Если только один слайд - показываем его без навигации, но с возможностью индикатора
  if (slides.length === 1) {
    console.log('=== CAROUSEL RENDER === SINGLE SLIDE', {
      carouselId: Id,
      willShowIndicator: showIndicators,
      indicatorText: '📷 1',
    });
    return (
      <div className={cn('relative w-full overflow-hidden', className)}>
        <div className="relative h-full w-full">{slides[0]}</div>
        {/* Индикатор для одного слайда */}
        {showIndicators && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-dark-300/80 text-light-100 rounded px-2 py-1 text-sm font-medium">
              📷 1
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleSlideChange = useCallback(
    (swiper: any) => {
      const newIndex = swiper.activeIndex;
      console.log('=== CAROUSEL SLIDE CHANGE ===', {
        carouselId: Id,
        fromIndex: activeIndex,
        toIndex: newIndex,
        totalSlides: slides.length,
      });
      setActiveIndex(newIndex);
    },
    [activeIndex, Id, slides.length]
  );

  const modules = [Navigation, Pagination];
  if (enableA11y) modules.push(A11y);

  // Множественные слайды - показываем полную карусель
  console.log('=== CAROUSEL RENDER === MULTIPLE SLIDES', {
    carouselId: Id,
    slidesCount: slides.length,
    willShowIndicator: showIndicators,
    activeIndex,
    modules: modules.map((m) => m.name || 'unknown'),
  });

  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      <Swiper
        className={className}
        modules={modules}
        slidesPerView={1}
        spaceBetween={0}
        keyboard={enableKeyboard ? { enabled: true } : false}
        a11y={
          enableA11y
            ? {
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
                firstSlideMessage: 'This is the first slide',
                lastSlideMessage: 'This is the last slide',
                paginationBulletMessage: 'Go to slide {{index}}',
              }
            : undefined
        }
        navigation={{
          prevEl: `#${Id}previous`,
          nextEl: `#${Id}next`,
          disabledClass: '!bg-dark-300/20',
        }}
        pagination={{
          el: `#${Id}bullets`,
          bulletClass: 'bg-light-100',
          bulletActiveClass: '!bg-accent-500',
          clickable: true,
          renderBullet: function (index: number, className: string) {
            return `<span class="w-[8px] h-[8px] cursor-pointer rounded-full ${className}"></span>`;
          },
        }}
        onSlideChange={handleSlideChange}
      >
        {slides.map((child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}

        {/* Навигационные кнопки */}
        <div className="absolute top-1/2 z-10 flex w-full translate-y-[-50%] justify-between px-[12px]">
          <button
            className="bg-dark-300/50 hover:bg-dark-300/70 focus:bg-dark-300/70 focus:outline-accent-500 cursor-pointer rounded-[2px] transition-opacity outline-none focus:outline-2"
            id={`${Id}previous`}
            aria-label="Previous slide"
            onClick={(e) => e.stopPropagation()} // Prevent event bubbling to parent
          >
            <IconSprite iconName="arrow-ios-back" width="48" height="48" />
          </button>
          <button
            className="bg-dark-300/50 hover:bg-dark-300/70 focus:bg-dark-300/70 focus:outline-accent-500 cursor-pointer rounded-[2px] transition-opacity outline-none focus:outline-2"
            id={`${Id}next`}
            aria-label="Next slide"
            onClick={(e) => e.stopPropagation()} // Prevent event bubbling to parent
          >
            <IconSprite iconName="arrow-ios-forward" width="48" height="48" />
          </button>
        </div>

        {/* Индикатор текущего слайда */}
        {showIndicators && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-dark-300/80 text-light-100 rounded px-2 py-1 text-sm font-medium">
              {activeIndex + 1} / {slides.length}
            </div>
          </div>
        )}

        {/* Пагинация */}
        <div className="relative z-10 flex justify-center">
          <div
            className="bg-dark-300/50 absolute bottom-[12px] mx-auto inline-flex justify-center gap-2 rounded-[2px] p-[8px]"
            id={`${Id}bullets`}
            onClick={(e) => e.stopPropagation()} // Prevent event bubbling to parent
          />
        </div>
      </Swiper>
    </div>
  );
};
