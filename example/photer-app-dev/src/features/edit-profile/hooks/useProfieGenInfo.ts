import { ChangeEvent, FormEventHandler } from 'react';
import { useEffect, useState } from 'react';
import {
  useCreateProfileGenInfoMutation,
  useGetCurrentUserQuery,
  useUpdateProfileGenInfoMutation,
} from '../api/profileApi';
import { RootState, useAppDispatch } from '@/shared/state/store';
import { useSelector } from 'react-redux';
import {
  useForm,
  Control,
  UseFormRegister,
  FieldErrors,
} from 'react-hook-form';
import {
  profileGenInfoSchema,
  ProfileGenInfoSchema,
} from '../general-iformation/genInfoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { setGenInfoData } from '../model/genInfoSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { isOlderThan13 } from '../lib/genInfoLib';
import { parse } from 'date-fns';

type useProfieGenInfoReturn = {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<ProfileGenInfoSchema>;
  control: Control<ProfileGenInfoSchema>;
  errors: FieldErrors<ProfileGenInfoSchema>;
  isDirty: boolean;
  isLoading: boolean;
  isError: boolean;
  countryCode: string | undefined;
  setCountryCode: (value: string) => void;
  handleChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  avatarUrl: string | null;
};
export const useProfieGenInfo = (): useProfieGenInfoReturn => {
  const [countryCode, setCountryCode] = useState<string>();
  const dispatch = useAppDispatch();
  const formData = useSelector((state: RootState) => state.genInfo.data);
  const [createGenInfo, { isLoading, isError }] =
    useCreateProfileGenInfoMutation();
  const { data: userInfoFromServer } = useGetCurrentUserQuery();
  const [updateGenInfo] = useUpdateProfileGenInfoMutation();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { isDirty, errors },
  } = useForm<ProfileGenInfoSchema>({
    resolver: zodResolver(profileGenInfoSchema),
    mode: 'onBlur',
    defaultValues: formData, // Устанавливаем начальные значения из Redux
  });

  useEffect(() => {
    if (userInfoFromServer) {
      reset(userInfoFromServer);
      setAvatarUrl(userInfoFromServer.avatarUrl);
    }
  }, [userInfoFromServer, reset]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    setValue(name as keyof ProfileGenInfoSchema, value);
    dispatch(setGenInfoData({ ...formData, [name]: value }));
  };

  const onSubmit = async (data: ProfileGenInfoSchema): Promise<void> => {
    if (data.birthDate) {
      const isOld = isOlderThan13(
        parse(data.birthDate, 'dd.MM.yyyy', new Date())
      );
      if (!isOld) {
        router.push('/privacy-policy');
        toast.error('A user under 13 cannot create a profile. Privacy Policy');
        return;
      }
    }
    try {
      if (userInfoFromServer) {
        const id = userInfoFromServer.id;
        await updateGenInfo({ id, data }).unwrap();
      } else {
        await createGenInfo(data).unwrap();
      }
      toast.success('Your settings are saved!');
    } catch (error) {
      console.error('Не удалось сохранить информацию: ', error);
      toast.error('Error! Server is not available!');
    }
  };
  return {
    handleSubmit: handleSubmit(onSubmit),
    register,
    control,
    errors,
    isDirty,
    isLoading,
    isError,
    countryCode,
    setCountryCode,
    handleChange,
    avatarUrl,
  };
};
