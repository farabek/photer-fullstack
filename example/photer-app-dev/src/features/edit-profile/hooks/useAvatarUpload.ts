import { useUploadAvatarMutation } from '../api/profileApi';

type UseAvatarUploadReturn = {
  uploadAvatar: (file: File) => Promise<string>;
  isLoading: boolean;
};
export const useAvatarUpload = (): UseAvatarUploadReturn => {
  const [uploadAvatar, { isLoading }] = useUploadAvatarMutation();

  const handleAvatarUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadAvatar(formData).unwrap();
      return response;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  return {
    uploadAvatar: handleAvatarUpload,
    isLoading,
  };
};
