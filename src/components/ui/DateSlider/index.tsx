'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';

import { EThumbNames, IDateSliderProps } from './types';

import { Thumb, Tooltip } from './components';
import { TooltipPositions } from './components/Tooltip/types';

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
      setMidVal(intermediateDateConvertedToMilliseconds || undefined);

      minValRef.current = minimumDateConvertedToMilliseconds;
      maxValRef.current = maximumDateConvertedToMilliseconds;
    }
  }, [minimumDateConvertedToMilliseconds, maximumDateConvertedToMilliseconds, intermediateDateConvertedToMilliseconds]);

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

  const handleOnMouseUp = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const dateInMillisecondsOnMouseUp = (event.target as HTMLInputElement).value;
    const thumbName = (event.target as HTMLInputElement).name;

    /*
    when the user finishes changing the slider, it returns the current values
    */
    onChangeCommited?.({
      minDateSelected: formatDateToCallback(
        (thumbName as EThumbNames) === EThumbNames.MIN_DATE ? Number(dateInMillisecondsOnMouseUp) : minVal,
      ),
      midDateSelected: formatDateToCallback(
        (thumbName as EThumbNames) === EThumbNames.MID_DATE ? Number(dateInMillisecondsOnMouseUp) : midVal || 0,
      ),
      maxDateSelected: formatDateToCallback(
        (thumbName as EThumbNames) === EThumbNames.MAX_DATE ? Number(dateInMillisecondsOnMouseUp) : maxVal,
      ),
    });
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateInMilliseconds = Number(event.target.value);
    const thumbName = event.target.name;

    switch (thumbName as EThumbNames) {
      case EThumbNames.MIN_DATE:
        /*
            The minimun value cannot be greater than the maximum value.
            read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min
        */
        const currentMinValue = midVal
          ? Math.min(dateInMilliseconds, maxVal - 1, midVal - 1)
          : Math.min(dateInMilliseconds, maxVal - 1);

        //set state to change the thumb left position
        setMinVal(currentMinValue);
        minValRef.current = currentMinValue;
        break;

      case EThumbNames.MID_DATE:
        /*
            The mid value cannot be less than the minimum value neither be greater than the maximum value.
        */
        const minValueMoreOne = minVal + 1;
        const maxValueMoreOne = maxVal + 1;

        const currentMidValue =
          minValueMoreOne +
          dateInMilliseconds +
          maxValueMoreOne -
          Math.min(minValueMoreOne, dateInMilliseconds, maxValueMoreOne) -
          Math.max(minValueMoreOne, dateInMilliseconds, maxValueMoreOne);

        //set state to change the thumb mid position
        setMidVal(currentMidValue);
        break;

      case EThumbNames.MAX_DATE:
        /*
            The maximum value cannot be less than the minimum value.
            read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
          */
        const currentMaxValue = midVal
          ? Math.max(dateInMilliseconds, minVal + 1, midVal + 1)
          : Math.max(dateInMilliseconds, minVal + 1);

        //set state to change the thumb right position
        setMaxVal(currentMaxValue);

        maxValRef.current = currentMaxValue;
        break;
    }
  };

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
      {Array.from([
        {
          name: EThumbNames.MIN_DATE,
          value: minVal,
          zIndex: minVal > maximumDateConvertedToMilliseconds - 100 ? 60 : 30,
        },
        {
          name: EThumbNames.MID_DATE,
          value: midVal,
          zIndex: 40,
        },
        {
          name: EThumbNames.MAX_DATE,
          value: maxVal,
          zIndex: 50,
        },
      ]).map((thumb) => {
        if (!thumb.value) return;

        return (
          <Thumb
            key={thumb.name}
            name={thumb.name}
            min={minimumDateConvertedToMilliseconds}
            max={maximumDateConvertedToMilliseconds}
            value={thumb.value}
            onMouseUp={handleOnMouseUp}
            onChange={handleOnChange}
            style={{ zIndex: thumb.zIndex, width }}
          />
        );
      })}

      <div className="relative" style={{ width }}>
        {/* bar */}
        <div className="absolute z-10 h-[5px] rounded-sm bg-[#1976D2] bg-opacity-35" style={{ width }} />

        {/* progress */}
        <div ref={range} className="absolute z-20 h-[5px] rounded-sm bg-[#1976D2]" style={{ width }} />

        {/* tooltips */}
        {Array.from([
          { value: minVal, ref: tooltipLeftRef, position: 'top' },
          { value: midVal, ref: tooltipMidRef, position: 'bottom' },
          { value: maxVal, ref: tooltipRightRef, position: 'top' },
        ]).map((tooltip, index) => {
          if (!tooltip.value) return;

          return (
            <Tooltip
              key={index}
              ref={tooltip.ref}
              value={format(new Date(tooltip.value), 'MMM dd yyyy')}
              position={tooltip.position as TooltipPositions}
            />
          );
        })}
      </div>
    </div>
  );
}
