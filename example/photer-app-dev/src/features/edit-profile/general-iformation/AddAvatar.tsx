import { Button } from '@/shared/ui';
import { ReactNode, useRef } from 'react';
import Image from 'next/image';
import defaultAvatar from '../../../../public/images/defaultAvatar.png';
import { useAvatarUpload } from '../hooks/useAvatarUpload';
import { toast } from 'react-toastify';

type Props = { avatarUrl?: string | null };
export const AddAvatar = ({ avatarUrl }: Props): ReactNode => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, isLoading } = useAvatarUpload();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      await uploadAvatar(file);
      toast.success(
        'Upload successful - profile will be refetched automatically'
      );
    } catch (error) {
      toast.error('Error uploading avatar');
      console.error('Failed to upload avatar:', error);
    }
  };

  const handleUploadClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <div className="flex max-w-[204px] flex-col items-center gap-[24px]">
      <div className="h-[204px] w-[204px] flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
        <Image
          src={avatarUrl || defaultAvatar}
          alt="avatar"
          width={204}
          height={204}
          className={'h-full w-full object-cover'}
          priority
          unoptimized
        />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <Button
        variant="outlined"
        className="w-[196px] whitespace-nowrap"
        onClick={handleUploadClick}
        disabled={isLoading}
      >
        {isLoading ? 'Uploading...' : 'Add a Profile Photo'}
      </Button>
    </div>
  );
};
