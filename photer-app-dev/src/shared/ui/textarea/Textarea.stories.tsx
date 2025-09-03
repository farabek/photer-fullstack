import { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '..';

export default {
  title: 'Components/Textarea',
  component: Textarea,
  argTypes: {
    disabled: { control: 'boolean' },
  },
} as Meta<typeof Textarea>;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: 'Your Message',
    placeholder: 'Type your message',
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    errorMessage: 'The value is not valid',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    value: 'Textarea',
  },
};
