import { ReactNode, useState } from 'react';
import { SpriteName } from 'public/icons/spriteNames';
import { IconSprite } from '@/shared/ui/icon/IconSprite';

type MenuItem = {
  title: string;
  iconName: SpriteName;
  callback: () => void;
};

type Props = {
  menuItems: MenuItem[];
};

export const EllipsisMenu = ({ menuItems }: Props): ReactNode => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer outline-none"
      >
        <IconSprite iconName="more-horizontal" />
      </button>
      {isOpen && (
        <div className="bg-dark-900 border-dark-100 absolute top-[45px] right-0 z-10 flex flex-col gap-[12px] rounded-[2px] border-[1px] p-[12px]">
          {menuItems.map((item: MenuItem) => (
            <button
              key={item.title}
              onClick={() => {
                setIsOpen(false);
                item.callback();
              }}
              className="text-light-100 flex cursor-pointer items-center gap-[12px] whitespace-nowrap"
            >
              <IconSprite iconName={item.iconName} />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
