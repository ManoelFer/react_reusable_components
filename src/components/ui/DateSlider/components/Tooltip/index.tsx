import { forwardRef } from 'react';

export const Tooltip = forwardRef<HTMLDivElement, { value: string; position?: 'top' | 'bottom' }>(
  ({ value, position = 'top' }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute w-[92px] shadow-md"
        style={{
          bottom: (position === 'top' && '0.5rem') || (position === 'bottom' && '-0.8rem') || '0.5rem',
          transform: (position === 'top' && undefined) || (position === 'bottom' && 'rotate(180deg)') || undefined,
        }}
      >
        <div
          className="-mt-8 truncate rounded bg-black px-2 py-1 text-xs text-white"
          style={{
            transform: (position === 'top' && undefined) || (position === 'bottom' && 'rotate(180deg)') || undefined,
          }}
        >
          {value}
        </div>
        <svg className="top-100 absolute left-0 h-2 w-full text-black" x="0px" y="0px" viewBox="0 0 255 255">
          <polygon className="fill-current" points="0,0 127.5,127.5 255,0"></polygon>
        </svg>
      </div>
    );
  },
);
