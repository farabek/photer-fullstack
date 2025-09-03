import { Meta, StoryObj } from '@storybook/react';

import ruFlag from 'public/icons/ru-flag.png';
import ukFlag from 'public/icons/uk-flag.png';
import { SelectBox } from './SelectBox';
import { SelectItem } from './SelectItem';

const meta = {
  component: SelectBox,
  argTypes: {
    placeholder: {
      control: 'text',
    },
    children: {
      table: {
        disable: true,
      },
    },
    title: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    placeholder: 'Choose value...',
    title: 'Select box',
    className: 'w-[210px]',
    disabled: false,
  },
} satisfies Meta<typeof SelectBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <SelectItem value={'value1'}>Value 1</SelectItem>
        <SelectItem value={'value2'}>Value 2</SelectItem>
        <SelectItem value={'value3'}>Value 3</SelectItem>
      </>
    ),

    className: 'w-[220px]',
  },
};

export const Languages: Story = {
  args: {
    children: (
      <>
        <SelectItem value={'value1'} icon={ruFlag}>
          Russian
        </SelectItem>
        <SelectItem value={'value2'} icon={ukFlag}>
          English
        </SelectItem>
      </>
    ),
    className: 'w-[164px]',
  },
};
