import { Textarea, Input } from '@/shared/ui';
import { UseFormRegister } from 'react-hook-form';
export type FormData = {
  description: string;
  tags: string;
};
type Props = {
  register: UseFormRegister<FormData>;
  errorMessage?: string;
  characterCount: number;
  maxLength: number;
  isValid: boolean;
};

export function PhotoPreviewTextArea({
  register,
  errorMessage,
  characterCount,
  maxLength,
  isValid,
}: Props): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Textarea
          {...register('description', {
            required: 'Description is required',
            maxLength: {
              value: maxLength,
              message: `Maximum ${maxLength} characters allowed`,
            },
            validate: (value) =>
              value.trim().length > 0 || 'Description cannot be empty',
          })}
          label="Add publication descriptions"
          placeholder="Add a description to your post..."
          className="min-h-[120px] w-full resize-none"
          errorMessage={errorMessage}
        />
        <span
          className={`regular-text-14 absolute right-0 -bottom-3 ${
            !isValid ? 'bottom-1 text-red-500' : 'text-light-900'
          }`}
        >
          {characterCount}/{maxLength}
        </span>
      </div>

      <Input
        {...register('tags')}
        label="Tags (optional)"
        placeholder="nature, photography, sunset"
        className="w-full"
      />
    </div>
  );
}
