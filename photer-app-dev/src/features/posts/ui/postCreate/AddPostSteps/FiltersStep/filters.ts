export type Filter = {
  name: string;
  className: string;
};

export const filters: Filter[] = [
  { name: 'Оригинал', className: '' },
  { name: 'Монохром', className: 'grayscale' },
  { name: 'Сепия', className: 'sepia' },
  { name: 'Контраст', className: 'contrast-125' },
  { name: 'Яркость', className: 'brightness-125' },
  { name: 'Насыщенность', className: 'saturate-150' },
];
