'use client';
import { toast, TypeOptions } from 'react-toastify';
import { useEffect } from 'react';

type Props = {
  messages: string[];
  type?: TypeOptions;
};

export const Toaster = ({ messages, type }: Props): null => {
  useEffect(() => {
    messages.forEach((message) => toast(message, { type }));
  }, [messages, type]);
  return null;
};
