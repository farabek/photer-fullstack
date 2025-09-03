import { Meta, StoryObj } from '@storybook/react';
import { Like } from './Like';

export default {
  title: 'Components/Like',
  component: Like,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Like>;

type Story = StoryObj<typeof Like>;

export const Default: Story = {};
