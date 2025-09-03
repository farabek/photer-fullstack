import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cca2Code, Country } from '../lib/profile.types';
export const countryApi = createApi({
  reducerPath: 'countryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://restcountries.com/v3.1',
  }),
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], void>({
      query: () => '/all?fields=name,flags,cca2',
    }),
    getCCA2Code: builder.query<Cca2Code[], string>({
      query: (name) => `/name/${name}`,
    }),
  }),
});

export const { useGetCountriesQuery, useLazyGetCCA2CodeQuery } = countryApi;
