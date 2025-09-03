import { Meta } from '@storybook/react';
import { Spinner } from '..';

export default {
  title: 'Components/Spinner',
  component: Spinner,
} as Meta<typeof Spinner>;

export const Default = {
  args: {
    size: 48,
  },
};

export const Small = {
  args: {
    size: 24,
  },
};

export const FullScreen = {
  args: {
    fullScreen: true,
  },
};
