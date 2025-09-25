import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/shared/ui/input/Input';

// Mock IconSprite component
jest.mock('@/shared/ui', () => ({
  IconSprite: ({ iconName, className, ...props }: any) => (
    <svg data-testid={`icon-${iconName}`} className={className} {...props} />
  ),
}));

// Mock cn utility
jest.mock('@/shared/lib/cn', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

describe('🧪 Input Component', () => {
  const user = userEvent.setup();

  describe('✅ Основная функциональность', () => {
    test('должен рендериться с базовыми пропсами', () => {
      render(<Input placeholder="Enter text" />);

      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    test('должен поддерживать разные типы input', () => {
      const types = ['text', 'email', 'password', 'search', 'date'] as const;

      types.forEach((type) => {
        const { rerender } = render(
          <Input type={type} data-testid={`input-${type}`} />
        );
        const input = screen.getByTestId(`input-${type}`);
        expect(input).toHaveAttribute('type', type === 'date' ? 'text' : type);
      });
    });

    test('должен использовать text тип по умолчанию', () => {
      render(<Input data-testid="default-input" />);

      const input = screen.getByTestId('default-input');
      expect(input).toHaveAttribute('type', 'text');
    });

    test('должен поддерживать controlled input', () => {
      const handleChange = jest.fn();
      render(
        <Input
          value="test value"
          onChange={handleChange}
          data-testid="controlled-input"
        />
      );

      const input = screen.getByTestId('controlled-input');
      expect(input).toHaveValue('test value');
    });

    test('должен поддерживать disabled состояние', () => {
      render(<Input disabled placeholder="Disabled input" />);

      const input = screen.getByPlaceholderText('Disabled input');
      expect(input).toBeDisabled();
    });

    test('должен поддерживать readOnly состояние', () => {
      render(
        <Input readOnly value="readonly value" data-testid="readonly-input" />
      );

      const input = screen.getByTestId('readonly-input');
      expect(input).toHaveAttribute('readonly');
      expect(input).toHaveValue('readonly value');
    });
  });

  describe('🏷️ Работа с лейблом', () => {
    test('должен рендериться с лейблом', () => {
      render(<Input label="Email Address" type="email" />);

      const label = screen.getByText('Email Address');
      const input = screen.getByLabelText('Email Address');

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'email');
    });

    test('должен показывать required индикатор', () => {
      render(<Input label="Required Field" required />);

      const label = screen.getByText('Required Field');
      expect(label).toBeInTheDocument();
      const asterisk = label.querySelector('span');
      expect(asterisk).toHaveClass('text-danger-500');
      expect(asterisk).toHaveTextContent('*');
    });

    test('не должен показывать лейбл для search типа', () => {
      render(<Input label="Search" type="search" />);

      expect(screen.queryByText('Search')).not.toBeInTheDocument();
    });
  });

  describe('🔍 Search функциональность', () => {
    test('должен рендерить search иконку для search типа', () => {
      render(<Input type="search" />);

      const searchIcon = screen.getByTestId('icon-search');
      expect(searchIcon).toBeInTheDocument();
    });

    test('должен вызывать onSearchClick при клике на search иконку', async () => {
      const handleSearch = jest.fn();
      render(<Input type="search" onSearchClick={handleSearch} />);

      const searchButton = screen.getByRole('button');
      await user.click(searchButton);

      expect(handleSearch).toHaveBeenCalledTimes(1);
    });

    test('должен применять специальные стили для search типа', () => {
      render(<Input type="search" data-testid="search-input" />);

      const input = screen.getByTestId('search-input');
      expect(input.className).toMatch(/pl-10/);
    });
  });

  describe('👁️ Password функциональность', () => {
    test('должен рендерить eye иконку для password типа', () => {
      render(<Input type="password" />);

      const eyeIcon = screen.getByTestId('icon-eye-off-outline');
      expect(eyeIcon).toBeInTheDocument();
    });

    test('должен переключать видимость пароля при клике на eye иконку', async () => {
      render(<Input type="password" data-testid="password-input" />);

      const input = screen.getByTestId('password-input');
      const toggleButton = screen.getByRole('button');

      // Initially hidden
      expect(input).toHaveAttribute('type', 'password');

      await user.click(toggleButton);
      await waitFor(() => {
        expect(input).toHaveAttribute('type', 'text');
      });

      // Check if eye icon changed
      expect(screen.getByTestId('icon-eye-outline')).toBeInTheDocument();

      await user.click(toggleButton);
      await waitFor(() => {
        expect(input).toHaveAttribute('type', 'password');
      });
    });

    test('должен применять специальные стили для password типа', () => {
      render(<Input type="password" data-testid="password-styled-input" />);

      const input = screen.getByTestId('password-styled-input');
      expect(input.className).toMatch(/pr-10/);
    });
  });

  describe('📅 Date функциональность', () => {
    test('должен рендерить calendar иконку для date типа', () => {
      render(<Input type="date" />);

      const calendarIcon = screen.getByTestId('icon-calendar');
      expect(calendarIcon).toBeInTheDocument();
    });

    test('должен конвертировать date тип в text для мобильных устройств', () => {
      render(<Input type="date" data-testid="date-input" />);

      const input = screen.getByTestId('date-input');
      expect(input).toHaveAttribute('type', 'text');
    });
  });

  describe('🎯 Focus и Blur события', () => {
    test('должен вызывать handleOnFocus при фокусе', () => {
      const handleFocus = jest.fn();
      render(<Input handleOnFocus={handleFocus} data-testid="focus-input" />);

      const input = screen.getByTestId('focus-input');
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    test('должен вызывать handleOnBlur при потере фокуса', () => {
      const handleBlur = jest.fn();
      render(<Input handleOnBlur={handleBlur} data-testid="blur-input" />);

      const input = screen.getByTestId('blur-input');
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    test('должен обновлять состояние фокуса', () => {
      render(<Input data-testid="focus-state-input" />);

      const input = screen.getByTestId('focus-state-input');

      // Initially not focused - placeholder should not be present by default
      expect(input).not.toHaveAttribute('placeholder');

      fireEvent.focus(input);
      // After focus, focus state should be managed correctly
      expect(input).toBeInTheDocument();
    });
  });

  describe('⌨️ Keyboard события', () => {
    test('должен вызывать onEnter при нажатии Enter', () => {
      const handleEnter = jest.fn();
      render(<Input onEnter={handleEnter} data-testid="enter-input" />);

      const input = screen.getByTestId('enter-input');
      fireEvent.keyDown(input, { code: 'Enter' });

      expect(handleEnter).toHaveBeenCalledTimes(1);
    });

    test('должен передавать onKeyDown события дальше', () => {
      const handleKeyDown = jest.fn();
      render(<Input onKeyDown={handleKeyDown} data-testid="keydown-input" />);

      const input = screen.getByTestId('keydown-input');
      fireEvent.keyDown(input, { code: 'Escape' });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    test('не должен вызывать onEnter для других клавиш', () => {
      const handleEnter = jest.fn();
      render(<Input onEnter={handleEnter} data-testid="no-enter-input" />);

      const input = screen.getByTestId('no-enter-input');
      fireEvent.keyDown(input, { code: 'Space' });

      expect(handleEnter).not.toHaveBeenCalled();
    });
  });

  describe('📝 Обработка изменений', () => {
    test('должен вызывать onChange при вводе текста', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} data-testid="change-input" />);

      const input = screen.getByTestId('change-input');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('должен вызывать onChangeValue с новым значением', () => {
      const handleChangeValue = jest.fn();
      render(
        <Input
          onChangeValue={handleChangeValue}
          data-testid="change-value-input"
        />
      );

      const input = screen.getByTestId('change-value-input');
      fireEvent.change(input, { target: { value: 'test input' } });

      expect(handleChangeValue).toHaveBeenCalledWith('test input');
    });

    test('должен поддерживать оба обработчика одновременно', () => {
      const handleChange = jest.fn();
      const handleChangeValue = jest.fn();

      render(
        <Input
          onChange={handleChange}
          onChangeValue={handleChangeValue}
          data-testid="both-handlers-input"
        />
      );

      const input = screen.getByTestId('both-handlers-input');
      fireEvent.change(input, { target: { value: 'both handlers' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChangeValue).toHaveBeenCalledWith('both handlers');
    });
  });

  describe('❌ Обработка ошибок', () => {
    test('должен показывать сообщение об ошибке', () => {
      render(
        <Input
          errorMessage="This field is required"
          data-testid="error-input"
        />
      );

      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-danger-500');

      const input = screen.getByTestId('error-input');
      expect(input.className).toMatch(/border-danger-500/);
    });

    test('должен применять разные стили при наличии ошибки', () => {
      render(
        <Input errorMessage="Invalid input" data-testid="error-styled-input" />
      );

      const input = screen.getByTestId('error-styled-input');
      expect(input.className).toMatch(/border-danger-500/);
    });
  });

  describe('🎨 Стилизация', () => {
    test('должен применять пользовательские классы', () => {
      render(
        <Input className="custom-input-class" data-testid="custom-input" />
      );

      const wrapper = screen.getByTestId('custom-input').closest('div');
      expect(wrapper?.className).toMatch(/custom-input-class/);
    });

    test('должен применять disabled стили', () => {
      render(<Input disabled data-testid="disabled-input" />);

      const input = screen.getByTestId('disabled-input');
      expect(input.className).toMatch(/disabled:text-dark-100/);
      expect(input.className).toMatch(/disabled:border-dark-100/);
    });

    test('должен применять focus стили', () => {
      render(<Input data-testid="focus-styled-input" />);

      const input = screen.getByTestId('focus-styled-input');
      expect(input.className).toMatch(/focus:border-accent-500/);
    });

    test('должен применять hover стили', () => {
      render(<Input data-testid="hover-styled-input" />);

      const input = screen.getByTestId('hover-styled-input');
      expect(input.className).toMatch(/hover:border-light-900/);
    });
  });

  describe('👶 Children и дополнительные элементы', () => {
    test('должен рендерить children', () => {
      render(
        <Input>
          <span data-testid="input-child">Additional content</span>
        </Input>
      );

      const child = screen.getByTestId('input-child');
      expect(child).toBeInTheDocument();
      expect(child).toHaveTextContent('Additional content');
    });
  });

  describe('🔧 Граничные случаи', () => {
    test('должен работать без пропсов', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    test('должен корректно обрабатывать пустые строки', () => {
      render(<Input value="" data-testid="empty-value-input" />);

      const input = screen.getByTestId('empty-value-input');
      expect(input).toHaveValue('');
    });

    test('должен корректно обрабатывать undefined значения', () => {
      render(<Input value={undefined} data-testid="undefined-value-input" />);

      const input = screen.getByTestId('undefined-value-input');
      expect(input).toHaveValue('');
    });
  });
});
