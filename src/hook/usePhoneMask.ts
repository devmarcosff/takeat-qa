import { useCallback } from 'react';
import { Path, PathValue, UseFormSetValue } from 'react-hook-form';

export function usePhoneMask<T extends Record<string, unknown>>(
  setValue: UseFormSetValue<T>,
  fieldName: Path<T>
) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value.replace(/\D/g, '');

      if (input.length > 11) input = input.slice(0, 11);
      if (input.length > 6) {
        input = input.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      } else if (input.length > 2) {
        input = input.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else if (input.length > 0) {
        input = input.replace(/(\d{0,2})/, '($1');
      }

      setValue(fieldName, input as PathValue<T, typeof fieldName>);
    },
    [setValue, fieldName]
  );

  return {
    onChange: handleChange,
  };
}
