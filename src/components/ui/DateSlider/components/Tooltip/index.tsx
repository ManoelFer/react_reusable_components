import { forwardRef } from 'react';

export const Tooltip = forwardRef<HTMLDivElement, { value: string }>(({ value }, ref) => {
  return (
    <div ref={ref} className="absolute bottom-2 w-[94px] shadow-md">
      <div className="-mt-8 truncate rounded bg-black px-2 py-1 text-xs text-white">{value}</div>
      <svg className="top-100 absolute left-0 h-2 w-full text-black" x="0px" y="0px" viewBox="0 0 255 255">
        <polygon className="fill-current" points="0,0 127.5,127.5 255,0"></polygon>
      </svg>
    </div>
  );
});
