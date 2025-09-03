'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ReactNode, useId } from 'react';
import 'swiper/css';
import { cn } from '@/shared/lib/cn';
import { IconSprite } from '@/shared/ui';

type Props = {
  className?: string;
  children: ReactNode | ReactNode[];
};

export const Carousel = ({ children, className }: Props): ReactNode => {
  const Id = useId().replaceAll(':', '_');

  if (!Array.isArray(children) || children.length <= 1) {
    return <div className={cn('w-full', className)}>{children}</div>;
  }

  return (
    <div className={cn('w-full overflow-hidden', className)}>
      <Swiper
        className={className}
        modules={[Navigation, Pagination]}
        slidesPerView={1}
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
          renderBullet: function (index, className) {
            return `<span class="w-[8px] h-[8px] cursor-pointer rounded-full ${className}"></span>`;
          },
        }}
      >
        {children.map((child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}
        <div className="absolute top-1/2 z-10 flex w-full translate-y-[-50%] justify-between px-[12px]">
          <button
            className="bg-dark-300/50 cursor-pointer rounded-[2px] outline-none"
            id={`${Id}previous`}
          >
            <IconSprite iconName="arrow-ios-back" width="48" height="48" />
          </button>
          <button
            className="bg-dark-300/50 cursor-pointer rounded-[2px] outline-none"
            id={`${Id}next`}
          >
            <IconSprite iconName="arrow-ios-forward" width="48" height="48" />
          </button>
        </div>
        <div className="relative z-10 flex justify-center">
          <div
            className="bg-dark-300/50 absolute bottom-[12px] mx-auto inline-flex justify-center gap-2 rounded-[2px] p-[8px]"
            id={`${Id}bullets`}
          ></div>
        </div>
      </Swiper>
    </div>
  );
};
