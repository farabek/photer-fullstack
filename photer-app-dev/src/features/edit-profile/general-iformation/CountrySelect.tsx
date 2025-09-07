import React, { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  useGetCountriesQuery,
  useLazyGetCCA2CodeQuery,
} from '../api/countryApi';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { Country } from '../lib/profile.types';

type Props = {
  handleSelectCountry: ({ cca2, name }: { cca2: string; name: string }) => void;
  value: string;
};
export const CountrySelect = ({
  handleSelectCountry,
  value,
}: Props): ReactNode => {
  const [currentCountry, setCurrentCountry] = useState(value ?? '');
  const [allCountries, setAllCountries] = useState([
    {
      value: 'Loading...',
      ui: <div>Loading...</div>,
    },
  ]);

  const { data: countries, error } = useGetCountriesQuery();

  const [getCca2Code, { data: cca2Code }] = useLazyGetCCA2CodeQuery();

  useEffect(() => {
    console.log('🔍 COUNTRY SELECT useEffect - VALUE CHANGE:', {
      value,
      isEmpty: !value || value.trim() === '',
      timestamp: new Date().toISOString(),
    });
    setCurrentCountry(value);
    if (value && value.trim() !== '') {
      getCca2Code(value);
    } else {
      console.log('🔍 COUNTRY SELECT - SKIPPING EMPTY VALUE QUERY');
    }
  }, [value, getCca2Code]);

  useEffect(() => {
    if (cca2Code) {
      handleSelectCountry({ cca2: cca2Code[0].cca2, name: value });
    }
  }, [cca2Code, handleSelectCountry, value]);

  const handleOptionClick = (selectedOption: string): void => {
    const cca2Code = countries?.find(
      (country: Country) => country.name.common === selectedOption
    )?.cca2;

    if (cca2Code) {
      const country = { cca2: cca2Code, name: selectedOption };
      handleSelectCountry(country);
    }
  };

  if (error) {
    return <div>Error</div>;
  }

  if (countries && allCountries.length === 1) {
    const cortedCountries = [...countries].sort((a: Country, b: Country) =>
      a.name.common.localeCompare(b.name.common)
    );
    const options = cortedCountries.map((country: Country) => ({
      value: country.name.common,
      ui: (
        <div className="flex gap-2 pl-2" key={country.cca2}>
          <Image
            src={country.flags.svg}
            alt={country.name.common}
            height={0}
            width={0}
            className="h-auto w-[25px] object-contain"
          />
          <div>{country.name.common}</div>
        </div>
      ),
    }));
    setAllCountries(options); // Обновление состояния
  }

  return (
    <AutocompleteDropdown
      className="w-full"
      onClick={handleOptionClick}
      options={allCountries}
      placeholder="Select country"
      inputValue={currentCountry}
      setInputValue={setCurrentCountry}
    />
  );
};
