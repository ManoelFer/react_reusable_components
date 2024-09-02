'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';

import { IDateSliderProps } from './types';

import { Thumb } from './components';

const formatDateToCallback = (dateInMilliseconds: number) => format(new Date(Number(dateInMilliseconds)), 'MM-dd-yyyy');

export function DateSlider({ minimumDate, maximumDate, width = 300, onChangeCommited }: IDateSliderProps) {
  /*
   1 - I did this conversion because it is easier to work with numbers here.
   2 - The code below obtains the time in milliseconds from January 1, 1970 to the specified date. "new Date().getTime()" .
   3 - These values ​​are fixed to control the minimum and maximum dates allowed in the slider.
  */
  const minimumDateConvertedToMilliseconds = new Date(minimumDate).getTime();
  const maximumDateConvertedToMilliseconds = new Date(maximumDate).getTime();

  //So that nextjs processes the same date as the client on the server and avoids the hydration error. read more: https://nextjs.org/docs/messages/react-hydration-error
  const [isClient, setIsClient] = useState(false);

  //states control the thumbs we can swipe
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(100);

  const minValRef = useRef(0);
  const maxValRef = useRef(100);

  //ref fill div to indicate percentage filled
  const range = useRef<HTMLDivElement>(null);

  /*
   1 - So that nextjs processes the same date as the client on the server and avoids the hydration error. 
   read more: https://nextjs.org/docs/messages/react-hydration-error

   2 - Update all states when parameters for minimum and maximum date are updated
  */
  useEffect(() => {
    setIsClient(true);

    if (minimumDateConvertedToMilliseconds && maximumDateConvertedToMilliseconds) {
      setMinVal(minimumDateConvertedToMilliseconds);
      setMaxVal(maximumDateConvertedToMilliseconds);

      minValRef.current = minimumDateConvertedToMilliseconds;
      maxValRef.current = maximumDateConvertedToMilliseconds;
    }
  }, [minimumDateConvertedToMilliseconds, maximumDateConvertedToMilliseconds]);

  /* ==================== CONTROL OF DIV FILLING ======================== */
  // Convert to percentage
  const getPercent = useCallback(
    (value: number) =>
      Math.round(
        ((value - minimumDateConvertedToMilliseconds) /
          (maximumDateConvertedToMilliseconds - minimumDateConvertedToMilliseconds)) *
          100,
      ),
    [minimumDateConvertedToMilliseconds, maximumDateConvertedToMilliseconds],
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;

      range.current.style.width = `${maxPercent - minPercent}%`;
    }

    // if (tooltipRef.current) {
    //   tooltipRef.current.style.left = `${minPercent}%`;
    // }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);
  /* ===================================================================== */

  //So that nextjs processes the same date as the client on the server and avoids the hydration error. read more: https://nextjs.org/docs/messages/react-hydration-error
  if (!isClient) return null;

  return (
    <div className="flex w-full justify-center" suppressHydrationWarning>
      <Thumb
        min={minimumDateConvertedToMilliseconds}
        max={maximumDateConvertedToMilliseconds}
        value={minVal}
        onMouseUp={(event) => {
          const minDateInMillisecondsOnMouseUp = (event.target as HTMLInputElement).value;

          /*
          when the user finishes changing the slider, it returns the current values
          */
          onChangeCommited?.({
            minDateSelected: formatDateToCallback(Number(minDateInMillisecondsOnMouseUp)),
            maxDateSelected: formatDateToCallback(maxVal),
          });
        }}
        onChange={(event) => {
          /*
            The minimun value cannot be greater than the maximum value.
            The Math.min() returns the smallest of the numbers given as input parameters

            example:
            console.log(Math.min(2, 3, 1)); => Expected output: 1

            console.log(Math.min(-2, -3, -1)); => Expected output: -3

            read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min
          */
          const value = Math.min(Number(event.target.value), maxVal - 1);

          //set state to change the thumb left position
          setMinVal(value);
          minValRef.current = value;
        }}
        style={{ zIndex: minVal > maximumDateConvertedToMilliseconds - 100 ? 50 : 30, width }}
      />

      <Thumb
        min={minimumDateConvertedToMilliseconds}
        max={maximumDateConvertedToMilliseconds}
        value={maxVal}
        onMouseUp={(event) => {
          const maxDateInMillisecondsOnMouseUp = (event.target as HTMLInputElement).value;

          /*
            when the user finishes changing the slider, it returns the current values
            */
          onChangeCommited?.({
            minDateSelected: formatDateToCallback(minVal),
            maxDateSelected: formatDateToCallback(Number(maxDateInMillisecondsOnMouseUp)),
          });
        }}
        onChange={(event) => {
          /*
            The maximum value cannot be less than the minimum value.
            The Math.max() returns the largest of the numbers given as input parameters

            example:
            console.log(Math.min(2, 3, 1)); => Expected output: 3

            console.log(Math.min(-2, -3, -1)); => Expected output: -1

            read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
          */
          const value = Math.max(Number(event.target.value), minVal + 1);

          //set state to change the thumb left position
          setMaxVal(value);

          maxValRef.current = value;
        }}
        style={{ zIndex: 40, width }}
      />

      <div className="relative" style={{ width }}>
        {/* bar div */}
        <div className="absolute z-10 h-[5px] rounded-sm bg-[#1976D2] bg-opacity-35" style={{ width }} />

        {/* fill div */}
        <div ref={range} className="absolute z-20 h-[5px] rounded-sm bg-[#1976D2]" style={{ width }} />

        {/* 
            1 - show left value 
            2 - convert milliseconds to Date
        */}
        <div className="absolute -left-5 mt-4 text-xs text-gray-300">{format(new Date(minVal), 'MMM dd yyyy')}</div>

        {/* 
            1 - show right value 
            2 - convert milliseconds to Date
        */}
        <div className="absolute -right-5 mt-4 text-xs text-gray-300">{format(new Date(maxVal), 'MMM dd yyyy')}</div>
      </div>
    </div>
  );
}
