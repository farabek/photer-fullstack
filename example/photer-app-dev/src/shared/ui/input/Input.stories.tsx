import { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    disabled: { control: 'boolean' },
    errorMessage: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Input>;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    type: 'text',
    label: 'Some label',
    placeholder: 'Type your message',
    className: 'w-[279px]',
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    errorMessage: 'Error text',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};
