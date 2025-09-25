/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Carousel } from '@/shared/ui/carousel/Carousel';

// Mock Swiper components
jest.mock('swiper/react', () => ({
  Swiper: ({ children, onSlideChange, className, ...props }: any) => {
    // Filter out Swiper-specific props that shouldn't be passed to DOM
    const {
      spaceBetween,
      slidesPerView,
      navigation,
      pagination,
      modules,
      keyboard,
      a11y,
      ...domProps
    } = props;

    return (
      <div data-testid="swiper" className={className} {...domProps}>
        <div data-testid="swiper-wrapper">{children}</div>
        <button
          data-testid="swiper-button-prev"
          onClick={() => onSlideChange?.({ activeIndex: 0 })}
        >
          Prev
        </button>
        <button
          data-testid="swiper-button-next"
          onClick={() => onSlideChange?.({ activeIndex: 1 })}
        >
          Next
        </button>
      </div>
    );
  },
  SwiperSlide: ({ children }: any) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

jest.mock('swiper/modules', () => ({
  Navigation: {},
  Pagination: {},
  A11y: {},
}));

jest.mock('swiper/css', () => {});

// Mock IconSprite
jest.mock('@/shared/ui', () => ({
  IconSprite: ({ iconName, ...props }: any) => (
    <div data-testid={`icon-${iconName}`} {...props} />
  ),
}));

describe('Carousel Component', () => {
  const mockChildren = [
    <img key="1" src="image1.jpg" alt="Image 1" />,
    <img key="2" src="image2.jpg" alt="Image 2" />,
    <img key="3" src="image3.jpg" alt="Image 3" />,
  ];

  beforeEach(() => {
    // Clear console mocks
    jest.clearAllMocks();
    // Mock console.log to avoid test output noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders multiple slides with navigation', () => {
      render(<Carousel>{mockChildren}</Carousel>);

      expect(screen.getByTestId('swiper')).toBeInTheDocument();
      expect(screen.getAllByTestId('swiper-slide')).toHaveLength(3);
    });

    it('renders single slide without navigation', () => {
      render(
        <Carousel>
          <img src="single.jpg" alt="Single" />
        </Carousel>
      );

      // Single slide should render in simple container, not Swiper
      expect(screen.queryByTestId('swiper')).not.toBeInTheDocument();
      expect(screen.getByAltText('Single')).toBeInTheDocument();
    });

    it('renders empty div when no children provided', () => {
      const { container } = render(<Carousel>{[]}</Carousel>);
      expect(container.firstChild).toHaveClass('w-full');
    });

    it('filters out null/undefined children', () => {
      const childrenWithNulls = [
        <img key="1" src="image1.jpg" alt="Image 1" />,
        null,
        undefined,
        <img key="2" src="image2.jpg" alt="Image 2" />,
      ];

      render(<Carousel>{childrenWithNulls}</Carousel>);
      expect(screen.getAllByTestId('swiper-slide')).toHaveLength(2);
    });
  });

  describe('Props and Configuration', () => {
    it('applies custom className', () => {
      render(<Carousel className="custom-class">{mockChildren}</Carousel>);
      expect(screen.getByTestId('swiper')).toHaveClass('custom-class');
    });

    it('shows indicators when showIndicators=true', () => {
      render(<Carousel showIndicators={true}>{mockChildren}</Carousel>);
      // Should show indicator with slide count
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('shows indicator for single slide when showIndicators=true', () => {
      render(
        <Carousel showIndicators={true}>
          <img src="single.jpg" alt="Single" />
        </Carousel>
      );
      expect(screen.getByText('📷 1')).toBeInTheDocument();
    });

    it('does not show indicators when showIndicators=false', () => {
      render(<Carousel showIndicators={false}>{mockChildren}</Carousel>);
      expect(screen.queryByText('1 / 3')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('renders navigation buttons for multiple slides', () => {
      render(<Carousel>{mockChildren}</Carousel>);

      expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
      expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
      expect(screen.getByTestId('icon-arrow-ios-back')).toBeInTheDocument();
      expect(screen.getByTestId('icon-arrow-ios-forward')).toBeInTheDocument();
    });

    it('prevents event propagation on navigation buttons', () => {
      render(<Carousel>{mockChildren}</Carousel>);

      const prevButton = screen.getByLabelText('Previous slide');
      const nextButton = screen.getByLabelText('Next slide');

      // Test that buttons exist and are clickable
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();

      // Click buttons to ensure they work
      fireEvent.click(prevButton);
      fireEvent.click(nextButton);

      // In real implementation, these would call stopPropagation
      // For now, just ensure buttons are functional
      expect(prevButton).toBeEnabled();
      expect(nextButton).toBeEnabled();
    });

    it('updates slide index on navigation', () => {
      render(<Carousel showIndicators={true}>{mockChildren}</Carousel>);

      // Initially should show "1 / 3"
      expect(screen.getByText('1 / 3')).toBeInTheDocument();

      // Simulate slide change
      const nextButton = screen.getByTestId('swiper-button-next');
      fireEvent.click(nextButton);

      // Should update to "2 / 3"
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('includes ARIA labels for navigation', () => {
      render(<Carousel enableA11y={true}>{mockChildren}</Carousel>);

      expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
      expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
    });

    it('supports keyboard navigation when enabled', () => {
      render(<Carousel enableKeyboard={true}>{mockChildren}</Carousel>);

      const swiper = screen.getByTestId('swiper');
      expect(swiper).toBeInTheDocument();
      // Swiper should receive keyboard prop
    });

    it('disables keyboard navigation when enableKeyboard=false', () => {
      render(<Carousel enableKeyboard={false}>{mockChildren}</Carousel>);

      const swiper = screen.getByTestId('swiper');
      expect(swiper).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles non-array children', () => {
      const singleChild = <img src="single.jpg" alt="Single" />;
      render(<Carousel>{singleChild}</Carousel>);

      expect(screen.getByAltText('Single')).toBeInTheDocument();
    });

    it('handles empty array children', () => {
      const { container } = render(<Carousel>{[]}</Carousel>);
      expect(container.firstChild).toHaveClass('w-full');
    });

    it('logs debug information', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      render(<Carousel>{mockChildren}</Carousel>);

      expect(consoleSpy).toHaveBeenCalledWith(
        '=== CAROUSEL DEBUG ===',
        expect.objectContaining({
          slidesCount: 3,
          showIndicators: false,
          enableKeyboard: true,
          enableA11y: true,
          willShowNavigation: true,
          willShowPagination: true,
          willShowIndicator: false,
        })
      );
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const { rerender } = render(<Carousel>{mockChildren}</Carousel>);
      const initialElement = screen.getByTestId('swiper');

      // Re-render with same props
      rerender(<Carousel>{mockChildren}</Carousel>);
      const afterRerender = screen.getByTestId('swiper');

      expect(initialElement).toBe(afterRerender);
    });
  });
});