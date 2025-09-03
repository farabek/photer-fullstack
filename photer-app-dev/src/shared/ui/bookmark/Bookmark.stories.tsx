import { Meta, StoryObj } from '@storybook/react';
import { Bookmark } from './Bookmark';

export default {
  title: 'Components/Bookmark',
  component: Bookmark,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Bookmark>;

type Story = StoryObj<typeof Bookmark>;

export const Default: Story = {};
