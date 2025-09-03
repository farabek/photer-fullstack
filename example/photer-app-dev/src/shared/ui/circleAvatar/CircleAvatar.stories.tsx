import { Meta, StoryObj } from '@storybook/react';
import { CircleAvatar } from './CircleAvatar';

export default {
  title: 'Components/CircleAvatar',
  component: CircleAvatar,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof CircleAvatar>;

type Story = StoryObj<typeof CircleAvatar>;

export const Default: Story = { args: { src: '/images/expired.png' } };
