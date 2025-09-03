import { Meta, StoryObj } from '@storybook/react';
import { Carousel } from './Carousel';
import Image from 'next/image';

export default {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Carousel>;

type Story = StoryObj<typeof Carousel>;

const slides = [
  <Image
    key={1}
    src={'/images/confirmed.png'}
    alt={'icon'}
    width={500}
    height={500}
    className="bg-light-100 flex-1 object-cover"
  />,
  <Image
    key={2}
    src={'/images/confirmed.png'}
    alt={'icon'}
    width={500}
    height={500}
    className="flex-1 object-cover"
  />,
  <div
    key={3}
    className="bg-light-100 flex h-[340px] w-full items-center justify-center"
  >
    &apos;div&apos;: Slide 5
  </div>,
];

export const Default: Story = {
  args: {
    className: 'max-w-[500px]',
    children: slides,
  },
};
