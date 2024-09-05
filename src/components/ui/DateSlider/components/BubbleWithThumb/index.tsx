import { forwardRef } from 'react';

import { IBubbleProps } from './types';

export const BubbleWithThumb = forwardRef<HTMLDivElement, IBubbleProps>(
  ({ value, position = 'top', playIsActive = false, refName }, ref) => {
    return (
      <div ref={ref} className="absolute -top-2 z-30 flex flex-col items-center">
        {/* CUSTOMIZE THUMB HERE */}
        <span className="relative flex h-5 w-5">
          {playIsActive && refName === 'mid' && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1976D2] opacity-75"></span>
          )}
          <span className="relative inline-flex h-5 w-5 rounded-full bg-[#1976D2]"></span>
        </span>

        {/* CUSTOMIZE BUBBLE HERE */}
        <div
          className="absolute top-7 w-[92px] shadow-md"
          style={{ top: (position === 'top' && '-2rem') || (position === 'bottom' && '1.75rem') || '1.75rem' }}
        >
          <span className="truncate rounded bg-black px-2 py-1 text-xs text-white">{value}</span>

          <svg
            className="absolute left-0 h-2 w-full text-black"
            x="0px"
            y="0px"
            viewBox="0 0 255 255"
            style={{
              transform: position === 'bottom' ? 'rotate(180deg)' : undefined,
              top: position === 'bottom' ? -5.5 : undefined,
            }}
          >
            <polygon className="fill-current" points="0,0 127.5,127.5 255,0"></polygon>
          </svg>
        </div>
      </div>
    );
  },
);
