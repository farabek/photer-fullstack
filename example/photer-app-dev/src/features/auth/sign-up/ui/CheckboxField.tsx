import { Checkbox } from '@/shared/ui';
import { Control, Controller } from 'react-hook-form';
import React from 'react';
import { SignUpFormData } from '../hooks/validationSchema';
import { TermsAndPrivacyLabel } from './TermsAndPrivacyLabel';

export function CheckboxField({
  control,
}: {
  control: Control<SignUpFormData>;
}): React.ReactElement {
  return (
    <Controller
      name="terms"
      control={control}
      render={({ field }) => (
        <Checkbox
          id="terms"
          label={<TermsAndPrivacyLabel />}
          onCheckedChange={(checked: boolean) => field.onChange(checked)}
        />
      )}
    />
  );
}
