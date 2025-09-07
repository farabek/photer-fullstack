import { ReactNode, useState, useEffect } from 'react';
import { GeneralInformation } from './general-iformation/GeneralInformation';
import { Devices } from './devices/Devices';
import { AccountManagement } from './account-management/AccountManagement';
import { MyPayments } from './my-payments/MyPayments';
import { ProfileTabs } from './profile-tabs/ProfileTabs';
import { Button } from '@/shared/ui';
import { appLogger } from '@/shared/lib/appLogger';

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

  // Логируем монтирование EditProfile компонента
  useEffect(() => {
    appLogger.profileSettings('EDIT_PROFILE_MOUNTED', {
      currentTab,
      availableTabs: tabs,
      timestamp: new Date().toISOString(),
    });

    // Логируем размонтирование
    return () => {
      appLogger.profileSettings('EDIT_PROFILE_UNMOUNTED', {
        currentTab,
        timestamp: new Date().toISOString(),
      });
    };
  }, []);

  // Логируем изменения вкладки
  useEffect(() => {
    appLogger.profileSettings('EDIT_PROFILE_TAB_CHANGED', {
      currentTab,
      timestamp: new Date().toISOString(),
    });
  }, [currentTab]);

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
          appLogger.profileSettings('EDIT_PROFILE_CANCEL_CLICKED', {
            currentTab,
            timestamp: new Date().toISOString(),
          });
          onClose();
        }}
      >
        Cancel
      </Button>
    </div>
  );
};
