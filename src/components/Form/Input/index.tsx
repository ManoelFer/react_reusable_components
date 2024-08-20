import { IInputProps } from './types';

import { Icons } from '@/assets/icons';

export function Input({ errorMessage, ...rest }: IInputProps) {
  const hasError = !!errorMessage?.length;

  return (
    <div className="flex flex-col">
      <input
        className={
          hasError
            ? 'block rounded border border-red-400 bg-transparent p-3 text-slate-200 placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-red-500'
            : `block rounded border border-slate-900 bg-transparent p-3 text-slate-200 placeholder-slate-500 focus:border-pink-500 focus:outline-none focus:ring-slate-900`
        }
        {...rest}
      />

      {hasError && (
        <div className="mt-1 flex items-center text-red-700">
          <Icons name="error" />
          <p className="ml-1 text-xs">{errorMessage[0]}</p>
        </div>
      )}
    </div>
  );
}
