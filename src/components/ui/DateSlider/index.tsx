'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';

import { IDateSliderProps } from './types';

import { Thumb, Tooltip } from './components';

const formatDateToCallback = (dateInMilliseconds: number) => format(new Date(Number(dateInMilliseconds)), 'MM-dd-yyyy');

export function DateSlider({
  minimumDate,
  maximumDate,
  intermediateDate,
  width = 300,
  onChangeCommited,
}: IDateSliderProps) {
  /*
   1 - I did this conversion because it is easier to work with numbers here.
   2 - The code below obtains the time in milliseconds from January 1, 1970 to the specified date. "new Date().getTime()" .
   3 - These values ​​are fixed to control the minimum and maximum dates allowed in the slider.
  */
  const minimumDateConvertedToMilliseconds = new Date(minimumDate).getTime();
  const maximumDateConvertedToMilliseconds = new Date(maximumDate).getTime();
  const intermediateDateConvertedToMilliseconds = intermediateDate ? new Date(intermediateDate).getTime() : null;

  //So that nextjs processes the same date as the client on the server and avoids the hydration error. read more: https://nextjs.org/docs/messages/react-hydration-error
  const [isClient, setIsClient] = useState(false);

  //states control the thumbs we can swipe
  const [minVal, setMinVal] = useState(0);
  const [midVal, setMidVal] = useState<number>();
  const [maxVal, setMaxVal] = useState(100);

  const minValRef = useRef(0);
  const maxValRef = useRef(100);

  //ref fill div to indicate percentage filled
  const range = useRef<HTMLDivElement>(null);

  //ref tooltip div to show the date
  const tooltipLeftRef = useRef<HTMLDivElement>(null);
  const tooltipRightRef = useRef<HTMLDivElement>(null);
  const tooltipMidRef = useRef<HTMLDivElement>(null);

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
      if (intermediateDateConvertedToMilliseconds) setMidVal(intermediateDateConvertedToMilliseconds);

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

    if (tooltipLeftRef.current && range.current) {
      const newVal = Number(
        ((minVal - minimumDateConvertedToMilliseconds) * 100) /
          (maximumDateConvertedToMilliseconds - minimumDateConvertedToMilliseconds),
      );

      tooltipLeftRef.current.style.left = `calc(${newVal}% + (${-38 - newVal * 0.15}px))`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }

    if (tooltipRightRef.current && range.current) {
      const newVal = Number(
        ((maxVal - minimumDateConvertedToMilliseconds) * 100) /
          (maximumDateConvertedToMilliseconds - minimumDateConvertedToMilliseconds),
      );

      tooltipRightRef.current.style.left = `calc(${newVal}% + (${-41 - newVal * 0.15}px))`;
    }
  }, [maxVal, getPercent]);

  // Manage middlw tooltip
  useEffect(() => {
    if (tooltipMidRef.current && range.current && midVal) {
      const newVal = Number(
        ((midVal - minimumDateConvertedToMilliseconds) * 100) /
          (maximumDateConvertedToMilliseconds - minimumDateConvertedToMilliseconds),
      );

      tooltipMidRef.current.style.left = `calc(${newVal}% + (${-41 - newVal * 0.15}px))`;
    }
  }, [midVal, getPercent]);
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
            midDateSelected: midVal ? formatDateToCallback(midVal) : undefined,
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
          const value = midVal
            ? Math.min(Number(event.target.value), maxVal - 1, midVal - 1)
            : Math.min(Number(event.target.value), maxVal - 1);

          //set state to change the thumb left position
          setMinVal(value);
          minValRef.current = value;
        }}
        style={{ zIndex: minVal > maximumDateConvertedToMilliseconds - 100 ? 60 : 30, width }}
      />

      {!!midVal && (
        <Thumb
          min={minimumDateConvertedToMilliseconds}
          max={maximumDateConvertedToMilliseconds}
          value={midVal}
          onMouseUp={(event) => {
            const midDateInMillisecondsOnMouseUp = (event.target as HTMLInputElement).value;

            /*
            when the user finishes changing the slider, it returns the current values
            */
            onChangeCommited?.({
              minDateSelected: formatDateToCallback(minVal),
              midDateSelected: formatDateToCallback(Number(midDateInMillisecondsOnMouseUp)),
              maxDateSelected: formatDateToCallback(maxVal),
            });
          }}
          onChange={(event) => {
            /*
            The mid value cannot be less than the minimum value neither be greater than the maximum value.
          */
            const currentMidValue = Number(event.target.value);

            const minValueMoreOne = minVal + 1;
            const maxValueMoreOne = maxVal + 1;

            const value =
              minValueMoreOne +
              currentMidValue +
              maxValueMoreOne -
              Math.min(minValueMoreOne, currentMidValue, maxValueMoreOne) -
              Math.max(minValueMoreOne, currentMidValue, maxValueMoreOne);

            //set state to change the thumb left position
            setMidVal(value);
          }}
          style={{ zIndex: 40, width }}
        />
      )}

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
            midDateSelected: midVal ? formatDateToCallback(midVal) : undefined,
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
          const value = midVal
            ? Math.max(Number(event.target.value), minVal + 1, midVal + 1)
            : Math.max(Number(event.target.value), minVal + 1);

          //set state to change the thumb left position
          setMaxVal(value);

          maxValRef.current = value;
        }}
        style={{ zIndex: 50, width }}
      />

      <div className="relative" style={{ width }}>
        {/* bar div */}
        <div className="absolute z-10 h-[5px] rounded-sm bg-[#1976D2] bg-opacity-35" style={{ width }} />

        {/* fill div */}
        <div ref={range} className="absolute z-20 h-[5px] rounded-sm bg-[#1976D2]" style={{ width }} />

        {/* 
            1 - show left tooltip value 
            2 - convert milliseconds to Date
        */}
        <Tooltip ref={tooltipLeftRef} value={format(new Date(minVal), 'MMM dd yyyy')} />

        {/* 
            1 - show mid value 
            2 - convert milliseconds to Date
        */}
        {!!midVal && <Tooltip ref={tooltipMidRef} value={format(new Date(midVal), 'MMM dd yyyy')} position="bottom" />}

        {/* 
            1 - show right value 
            2 - convert milliseconds to Date
        */}
        <Tooltip ref={tooltipRightRef} value={format(new Date(maxVal), 'MMM dd yyyy')} />
      </div>
    </div>
  );
}
