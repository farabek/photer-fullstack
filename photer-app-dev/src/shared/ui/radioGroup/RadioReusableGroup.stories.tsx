import { Meta, StoryObj } from '@storybook/react';
import { RadioReusableGroup } from '..';

export default {
  title: 'Components/RadioGroup',
  component: RadioReusableGroup,
} satisfies Meta<typeof RadioReusableGroup>;

type Story = StoryObj<typeof RadioReusableGroup>;

export const Default: Story = {
  args: {
    options: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ],
  },
};

export const VerticalOrientation: Story = {
  args: {
    options: Default.args?.options,
    orientation: 'vertical',
  },
};

export const WithDefaultValue: Story = {
  args: {
    options: Default.args?.options,
    defaultValue: '1',
  },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      {
        value: '1',
        label: 'Option 1',
      },
      {
        value: '2',
        label: 'Option 2',
        disabled: true,
      },
    ],
  },
};
