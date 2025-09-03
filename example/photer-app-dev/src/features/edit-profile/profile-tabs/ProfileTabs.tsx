'use client';
import { ReactNode } from 'react';
import { Tabs } from '../EditProfile';
import { TabsButton } from './TabsButton';

type Props = {
  tabs: Tabs;
  currentTab: string;
  setCurrentTabAction: (tab: string) => void;
};
export const ProfileTabs = ({
  tabs,
  currentTab,
  setCurrentTabAction,
}: Props): ReactNode => {
  return (
    <div className="flex w-full">
      {tabs.map((tab, index) => (
        <TabsButton
          key={index}
          isActive={tab === currentTab}
          onClick={() => {
            setCurrentTabAction(tab);
          }}
        >
          {tab}
        </TabsButton>
      ))}
    </div>
  );
};
