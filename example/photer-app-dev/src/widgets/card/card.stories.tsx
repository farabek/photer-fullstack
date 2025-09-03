import { Meta, StoryObj } from '@storybook/react';
import { Card } from './card';

const meta = {
  component: Card,
  title: 'Components/Card',
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className={'flex flex-col items-center justify-center p-5'}>
        <span className="text-light-100">Default card</span>
      </div>
    ),
  },
};
