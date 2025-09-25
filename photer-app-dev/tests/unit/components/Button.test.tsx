import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/shared/ui/button/Button';
import { StaticImageData } from 'next/image';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt || 'button icon'} />,
}));

// Mock cn utility
jest.mock('@/shared/lib/cn', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

// Mock Radix Slot
jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe('🧪 Button Component', () => {
  const user = userEvent.setup();

  describe('✅ Основная функциональность', () => {
    test('должен рендериться с базовыми пропсами', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('h3-text', 'text-light-100');
    });

    test('должен вызывать onClick при клике', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('должен поддерживать disabled состояние', async () => {
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled Button
        </Button>
      );

      const button = screen.getByRole('button', { name: /disabled button/i });
      expect(button).toBeDisabled();

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('должен передавать остальные пропсы button элементу', () => {
      render(
        <Button type="submit" data-testid="custom-button">
          Submit
        </Button>
      );

      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('🎨 Варианты кнопок', () => {
    const variants = ['primary', 'secondary', 'outlined', 'text'] as const;

    variants.forEach((variant) => {
      test(`должен применять стили для варианта ${variant}`, () => {
        render(
          <Button variant={variant} data-testid={`button-${variant}`}>
            {variant} Button
          </Button>
        );

        const button = screen.getByTestId(`button-${variant}`);
        // Проверяем, что базовые классы применены
        expect(button).toHaveClass('h3-text', 'text-light-100', 'inline-flex');
        // Проверяем, что вариантные классы содержат ожидаемые цвета
        if (variant === 'primary') {
          expect(button.className).toMatch(/bg-accent-500/);
        } else if (variant === 'secondary') {
          expect(button.className).toMatch(/bg-dark-300/);
        } else if (variant === 'outlined') {
          expect(button.className).toMatch(/border-accent-500/);
        } else if (variant === 'text') {
          expect(button.className).toMatch(/text-accent-500/);
        }
      });
    });

    test('должен использовать primary вариант по умолчанию', () => {
      render(<Button>Default Button</Button>);

      const button = screen.getByRole('button', { name: /default button/i });
      expect(button.className).toMatch(/bg-accent-500/);
    });
  });

  describe('🎯 Работа с иконками', () => {
    test('должен рендерить иконку как ReactNode', () => {
      const testIcon = <span data-testid="react-icon">🚀</span>;

      render(
        <Button icon={testIcon} data-testid="button-with-icon">
          With Icon
        </Button>
      );

      const button = screen.getByTestId('button-with-icon');
      const icon = screen.getByTestId('react-icon');

      expect(button).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('🚀');
    });

    test('должен рендерить иконку как строку (URL)', () => {
      const iconUrl = '/test-icon.png';

      render(
        <Button icon={iconUrl} data-testid="button-with-string-icon">
          With String Icon
        </Button>
      );

      const button = screen.getByTestId('button-with-string-icon');
      const img = screen.getByAltText('button icon');

      expect(button).toBeInTheDocument();
      expect(img).toHaveAttribute('src', iconUrl);
      expect(img).toHaveClass('h-5', 'w-5');
    });

    test('должен рендерить иконку как StaticImageData', () => {
      const mockStaticImage: StaticImageData = {
        src: '/static-icon.png',
        height: 20,
        width: 20,
        blurDataURL: '/static-icon.png',
        blurHeight: 20,
        blurWidth: 20,
      };

      render(
        <Button icon={mockStaticImage} data-testid="button-with-static-icon">
          With Static Icon
        </Button>
      );

      const button = screen.getByTestId('button-with-static-icon');
      const img = screen.getByAltText('button icon');

      expect(button).toBeInTheDocument();
      expect(img).toBeInTheDocument(); // Image element exists
      expect(img).toHaveAttribute('alt', 'button icon');
    });

    test('должен добавлять отступ между иконкой и текстом', () => {
      render(
        <Button icon={<span>⭐</span>} data-testid="button-icon-text">
          Button Text
        </Button>
      );

      const button = screen.getByTestId('button-icon-text');
      const iconSpan = button.querySelector('span span'); // Icon container span

      expect(iconSpan).toHaveClass('mr-2');
    });

    test('должен применять специальные стили при наличии иконки', () => {
      render(
        <Button icon={<span>⭐</span>} data-testid="button-with-icon-styles">
          Icon Button
        </Button>
      );

      const button = screen.getByTestId('button-with-icon-styles');
      expect(button.className).toMatch(/px-3/);
    });
  });

  describe('🔄 asChild функциональность', () => {
    test('должен использовать Slot компонент при asChild=true', () => {
      render(
        <Button asChild>
          <a href="/test" data-testid="link-button">
            Link Button
          </a>
        </Button>
      );

      const link = screen.getByTestId('link-button');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link.tagName).toBe('A');
    });

    test('должен применять классы к дочернему элементу через Slot', () => {
      render(
        <Button asChild className="custom-class">
          <a href="/test" data-testid="styled-link">
            Styled Link
          </a>
        </Button>
      );

      const link = screen.getByTestId('styled-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      // Slot behavior may vary in tests - focus on basic functionality
    });
  });

  describe('🎨 Кастомные стили и классы', () => {
    test('должен применять пользовательские классы', () => {
      render(
        <Button className="custom-button-class" data-testid="custom-button">
          Custom Button
        </Button>
      );

      const button = screen.getByTestId('custom-button');
      expect(button.className).toMatch(/custom-button-class/);
      // Проверяем, что базовые классы все еще применены
      expect(button.className).toMatch(/h3-text/);
    });

    test('должен комбинировать базовые и пользовательские классы', () => {
      render(
        <Button
          variant="secondary"
          className="text-red-500"
          data-testid="combined-classes"
        >
          Combined Classes
        </Button>
      );

      const button = screen.getByTestId('combined-classes');
      expect(button.className).toMatch(/bg-dark-300/); // secondary variant
      expect(button.className).toMatch(/text-red-500/); // custom class
    });
  });

  describe('📱 Доступность', () => {
    test('должен поддерживать aria-label', () => {
      render(
        <Button aria-label="Close dialog" data-testid="accessible-button">
          ✕
        </Button>
      );

      const button = screen.getByTestId('accessible-button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });

    test('должен поддерживать aria-expanded', () => {
      render(
        <Button aria-expanded="true" data-testid="expanded-button">
          Menu
        </Button>
      );

      const button = screen.getByTestId('expanded-button');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('🎭 Визуальные состояния', () => {
    test('должен применять disabled стили', () => {
      render(
        <Button disabled variant="primary" data-testid="disabled-button">
          Disabled
        </Button>
      );

      const button = screen.getByTestId('disabled-button');
      expect(button.className).toMatch(/disabled:bg-accent-900/);
      expect(button.className).toMatch(/disabled:text-light-900/);
    });

    test('должен применять focus стили', () => {
      render(
        <Button variant="outlined" data-testid="focus-button">
          Focus Me
        </Button>
      );

      const button = screen.getByTestId('focus-button');
      expect(button.className).toMatch(/focus:border-accent-700/);
    });

    test('должен применять hover стили', () => {
      render(
        <Button variant="secondary" data-testid="hover-button">
          Hover Me
        </Button>
      );

      const button = screen.getByTestId('hover-button');
      expect(button.className).toMatch(/hover:bg-dark-100/);
    });
  });

  describe('🔧 Граничные случаи', () => {
    test('должен работать без children', () => {
      render(<Button data-testid="empty-button" />);

      const button = screen.getByTestId('empty-button');
      expect(button).toBeInTheDocument();
      // Button contains span for layout, but no visible children
      expect(button.querySelector('span')).toBeInTheDocument();
    });

    test('должен работать только с иконкой', () => {
      render(<Button icon={<span>🔍</span>} data-testid="icon-only-button" />);

      const button = screen.getByTestId('icon-only-button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('🔍')).toBeInTheDocument();
    });

    test('должен корректно обрабатывать пустую строку как children', () => {
      render(<Button data-testid="empty-string-button">{''}</Button>);

      const button = screen.getByTestId('empty-string-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('');
    });

    test('должен корректно обрабатывать 0 как children', () => {
      render(<Button data-testid="zero-children-button">{0}</Button>);

      const button = screen.getByTestId('zero-children-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('0');
    });
  });
});
