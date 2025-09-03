import { Meta } from '@storybook/react';
import { spriteNames } from 'public/icons/spriteNames';
import { ReactElement } from 'react';
import { IconSprite } from './IconSprite';

export default {
  title: 'Components/IconSprite',
  component: IconSprite,
} as Meta<typeof IconSprite>;

export const AllIconsInSprite = (): ReactElement => (
  <div
    style={{
      display: 'flex',
      gap: '40px',
      padding: '40px',
      flexWrap: 'wrap',
      maxWidth: '80%',
      margin: '0 auto',
    }}
  >
    {spriteNames.map((name) => (
      <div
        key={name}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconSprite
          height={50}
          width={50}
          iconName={name}
          className="fill-white"
        />
        <p style={{ textAlign: 'center', color: 'white' }}>{name}</p>
      </div>
    ))}
  </div>
);
