import { ReactNode, useState } from 'react';
import { GeneralInformation } from './general-iformation/GeneralInformation';
import { Devices } from './devices/Devices';
import { AccountManagement } from './account-management/AccountManagement';
import { MyPayments } from './my-payments/MyPayments';
import { ProfileTabs } from './profile-tabs/ProfileTabs';
import { Button } from '@/shared/ui';

const tabs = [
  'General iformation',
  'Devices',
  'Account Management',
  'My payments',
];
export type Tabs = typeof tabs;

type Props = { onClose: () => void };
export const EditProfile = ({ onClose }: Props): ReactNode => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  const renderTab = (): ReactNode => {
    switch (currentTab) {
      case 'General iformation':
        return <GeneralInformation />;
      case 'Devices':
        return <Devices />;
      case 'Account Management':
        return <AccountManagement />;
      case 'My payments':
        return <MyPayments />;
      default:
        return <div>Выберите компонент</div>;
    }
  };
  return (
    <div className="flex w-full flex-col">
      <ProfileTabs
        tabs={tabs}
        currentTab={currentTab}
        setCurrentTabAction={setCurrentTab}
      />
      <div className="mt-[24px]">{renderTab()}</div>
      <Button
        className="mt-[24px] ml-auto w-[160px]"
        onClick={() => {
          onClose();
        }}
      >
        Cancel
      </Button>
    </div>
  );
};
