import React, { ReactNode, useEffect, useState } from 'react';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { City } from 'country-state-city';

type Props = {
  cca2Code?: string | undefined;
  onChange: (value: string) => void;
  value: string;
};

export const SitySelect = ({ cca2Code, onChange, value }: Props): ReactNode => {
  const [currentCCa2Code, setCurrentCCa2Code] = useState<string | undefined>();

  useEffect(() => {
    if (!currentCCa2Code && cca2Code) {
      setCurrentCCa2Code(cca2Code);
    } else if (cca2Code !== currentCCa2Code && cca2Code) {
      setCurrentCCa2Code(cca2Code);
      onChange('');
    }
  }, [cca2Code, onChange, currentCCa2Code]);

  let options = [];
  if (cca2Code) {
    const cities = City.getCitiesOfCountry(cca2Code);
    if (!cities) {
      return <div>Error</div>;
    }
    options = cities.map((city) => ({
      value: city.name,
      ui: <div>{city.name}</div>,
    }));
  } else {
    options = [
      {
        value: 'Select country first',
        ui: <div>{'Select country first'}</div>,
      },
    ];
  }

  const handleChange = (selectedOption: string): void => {
    onChange(selectedOption);
  };

  return (
    <AutocompleteDropdown
      options={options}
      className="w-full"
      placeholder={'Select city'}
      onClick={handleChange}
      inputValue={value}
    />
  );
};
