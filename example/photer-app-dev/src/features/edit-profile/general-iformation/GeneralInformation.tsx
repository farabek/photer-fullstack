'use client';
import { Button, Input, Textarea } from '@/shared/ui';
import { Controller } from 'react-hook-form';
import { SitySelect } from './SitySelect';
import { Calendar } from './Calendar/Calendar';
import { CountrySelect } from './CountrySelect';
import { useProfieGenInfo } from '../hooks/useProfieGenInfo';
import { ReactNode } from 'react';
import { convertDateToString, convertStringToDate } from '../lib/genInfoLib';
import { AddAvatar } from './AddAvatar';

export const GeneralInformation = (): ReactNode => {
  const {
    handleSubmit,
    handleChange,
    register,
    control,
    errors,
    countryCode,
    setCountryCode,
    isLoading,
    isError,
    isDirty,
    avatarUrl,
  } = useProfieGenInfo();

  return (
    <div className="flex w-full flex-col">
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <div className="flex-1">
            <AddAvatar avatarUrl={avatarUrl} />
          </div>
          <div className="flex-3">
            <Input
              type="text"
              required
              label="Username"
              errorMessage={errors.username?.message}
              {...register('username')}
              onChange={handleChange}
            />
            <Input
              type="text"
              required
              label="First name"
              errorMessage={errors.firstName?.message}
              {...register('firstName')}
              onChange={handleChange}
            />
            <Input
              type="text"
              required
              label="Last name"
              errorMessage={errors.lastName?.message}
              {...register('lastName')}
              onChange={handleChange}
            />
            <Controller
              name="birthDate"
              control={control}
              render={({ field: { onChange, value } }) => {
                const date = convertStringToDate(value);
                return (
                  <Calendar
                    selected={date}
                    onChange={(date: Date | null) => {
                      if (date) {
                        const event = {
                          target: {
                            name: 'birthday',
                            value: convertDateToString(date),
                          },
                        };
                        onChange(event);
                      }
                    }}
                  />
                );
              }}
            />
            <div className="mt-[16px] flex justify-between gap-2">
              <Controller
                name="country"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CountrySelect
                    value={value ?? ''}
                    handleSelectCountry={(country) => {
                      setCountryCode(country.cca2);
                      onChange(country.name);
                    }}
                  />
                )}
              />
              <Controller
                name="city"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SitySelect
                    cca2Code={countryCode}
                    onChange={onChange}
                    value={value ?? ''}
                  />
                )}
              />
            </div>
            <Textarea
              label="About me"
              errorMessage={errors.aboutMe?.message}
              {...register('aboutMe')}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="border-dark-300 mt-[24px] flex justify-end border-t-[1px] pt-[24px]">
          <Button type="submit" disabled={!isDirty || isError}>
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
