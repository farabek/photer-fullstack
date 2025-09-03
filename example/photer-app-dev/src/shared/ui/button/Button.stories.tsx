import { Meta, StoryObj } from '@storybook/react';

import ukFlag from 'public/icons/uk-flag.png';
import { Button } from '..';

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Outlined: Story = {
  args: {
    children: 'Outline',
    variant: 'outlined',
  },
};

export const Text: Story = {
  args: {
    children: 'Text',
    variant: 'text',
  },
};

export const iconWithText: Story = {
  args: {
    children: 'English',
    variant: 'secondary',
    icon: ukFlag,
  },
};

export const icon: Story = {
  args: {
    variant: 'secondary',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
  },
};

export const AsLink: StoryObj<typeof Button> = {
  args: {
    variant: 'primary',
    asChild: true,
    children: <a href={'https://www.google.com'}>AsLink</a>,
  },
};
