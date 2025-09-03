import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { LogoutModal } from '@/features/auth/ui/login-form/LogoutForm';
import { LogoutButton } from './LogoutButton';

const meta: Meta<typeof LogoutButton> = {
  title: 'Components/LogoutButton',
  component: LogoutButton,
  tags: ['autodocs'],
  argTypes: {
    openModal: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof LogoutButton>;

export const Default: Story = {
  args: {
    openModal: () => console.log('Logout modal opened'),
  },
  render: function DefaultStory(): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = (): void => {
      console.log('Logout modal opened');
      setIsOpen(true);
    };

    const closeModal = (): void => setIsOpen(false);

    const handleConfirmLogout = (): void => {
      console.log('User confirmed logout');
      closeModal();
    };

    return (
      <>
        <LogoutButton openModal={openModal} />
        <LogoutModal
          open={isOpen}
          userEmail="user@example.com"
          onConfirmed={handleConfirmLogout}
          onCanceled={closeModal}
        />
      </>
    );
  },
};
