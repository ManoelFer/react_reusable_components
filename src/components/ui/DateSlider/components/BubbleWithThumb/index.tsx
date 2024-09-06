import { forwardRef } from 'react';

import { IBubbleProps } from './types';

const Indicator = ({ position }: Pick<IBubbleProps, 'position'>) => {
  return (
    <svg
      className="h-2 w-full text-gray-500"
      x="0px"
      y="0px"
      viewBox="0 0 255 255"
      style={{
        transform: position === 'bottom' ? 'rotate(180deg)' : undefined,
      }}
    >
      <polygon className="fill-current" points="0,0 127.5,127.5 255,0"></polygon>
    </svg>
  );
};

export const BubbleWithThumb = forwardRef<HTMLDivElement, IBubbleProps>(
  ({ value, position = 'top', playIsActive = false, refName }, ref) => {
    return (
      <div ref={ref} className="absolute z-30 flex flex-col items-center">
        {/* CUSTOMIZE THUMB HERE */}
        <span className="relative flex h-[20px] w-[20px]">
          {playIsActive && refName === 'mid' && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1976D2] opacity-75"></span>
          )}
          <span className="relative inline-flex h-[20px] w-[20px] rounded-full bg-[#1976D2] shadow-md"></span>
        </span>

        {/* CUSTOMIZE BUBBLE HERE */}
        <div
          className="align-center absolute flex flex-col"
          style={{ top: (position === 'top' && '-2rem') || (position === 'bottom' && '1.3rem') || '1.3rem' }}
        >
          {position === 'bottom' && <Indicator position={position} />}

          <div className="w-full rounded bg-gray-500 shadow-md">
            <span className="flex w-full justify-center truncate px-2 py-1 text-xs text-white">{value}</span>
          </div>

          {position === 'top' && <Indicator position={position} />}
        </div>
      </div>
    );
  },
);

BubbleWithThumb.displayName = 'BubbleWithThumb';
