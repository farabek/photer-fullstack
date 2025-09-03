import { Meta, StoryObj } from '@storybook/react';
import { spriteNames } from 'public/icons/spriteNames';
import { IconSprite } from './IconSprite';

export default {
  title: 'Components/IconSprite',
  component: IconSprite,
  argTypes: {
    iconName: {
      control: {
        type: 'select',
      },
      options: spriteNames,
    },
  },
} as Meta<typeof IconSprite>;

type Story = StoryObj<typeof IconSprite>;

export const Icon: Story = {
  args: {
    iconName: 'search',
    width: '300',
    height: '300',
  },
  parameters: {
    layout: 'centered',
  },
};
