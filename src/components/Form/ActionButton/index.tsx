'use client';

import { useFormStatus } from 'react-dom';

import { IActionButtonProps } from './types';

export function ActionButton({ label, actionKey, actionValue, action, ...rest }: IActionButtonProps) {
  //TODO: RETURNS THE STATE OF THE <form>... parent element.
  const { pending } = useFormStatus();

  return (
    <form action={action}>
      <input type="hidden" name={actionKey} value={actionValue} />
      <button type="submit" disabled={pending} {...rest}>
        {label}
      </button>
    </form>
  );
}
