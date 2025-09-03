import { Meta } from '@storybook/react';
import { Scrollbar } from './Scrollbar';

export default {
  title: 'Components/Scrollbar',
  component: Scrollbar,
  argTypes: {
    type: {
      options: ['auto', 'always', 'scroll', 'hover'],
      control: { type: 'radio' },
    },
  },
} as Meta<typeof Scrollbar>;

export const VerticalScrollbar = {
  args: {
    style: {
      height: '200px',
      width: 'fit-content',
      paddingRight: '8px',
      color: 'white',
    },
    children: (
      <p className="w-[120px]">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
        autem, beatae debitis, earum maiores nam omnis perspiciatis quas quasi
        ratione tenetur voluptas voluptatem! Blanditiis ducimus, excepturi iste
        iure quos veritatis. Lorem ipsum dolor sit amet, consectetur adipisicing
        elit. Adipisci, autem, beatae debitis, earum maiores nam omnis
        perspiciatis quas quasi ratione tenetur voluptas voluptatem! Blanditiis
        ducimus, excepturi iste iure quos veritatis. Lorem ipsum dolor sit amet,
        consectetur adipisicing elit. Adipisci, autem, beatae debitis, earum
        maiores nam omnis perspiciatis quas quasi ratione tenetur voluptas
        voluptatem! Blanditiis ducimus, excepturi iste iure quos veritatis.
      </p>
    ),
  },
};

export const HorizontalScrollbar = {
  args: {
    style: { width: '200px', color: 'white' },
    children: (
      <p className="my-4 w-[400px]">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
        autem, beatae debitis, earum maiores nam omnis perspiciatis quas quasi
        ratione tenetur voluptas voluptatem! Blanditiis ducimus, excepturi iste
        iure quos veritatis. Lorem ipsum dolor sit amet, consectetur adipisicing
        elit. Adipisci, autem, beatae debitis, earum maiores nam omnis
        perspiciatis quas quasi ratione tenetur voluptas voluptatem! Blanditiis
        ducimus, excepturi iste iure quos veritatis. Lorem ipsum dolor sit amet,
        consectetur adipisicing elit. Adipisci, autem, beatae debitis, earum
        maiores nam omnis perspiciatis quas quasi ratione tenetur voluptas
        voluptatem! Blanditiis ducimus, excepturi iste iure quos veritatis.
      </p>
    ),
  },
};
