'use client';

import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';

import { EThumbNames, IDateSliderProps } from './types';

import { ThumbRefComponent, BubbleWithThumb } from './components';
import { BubblePositions } from './components/BubbleWithThumb/types';

import { dayInMilliseconds, formatDateToCallback, getSliderPercentage, getThumbPosition } from './utils';

let countIntermediateDate = 0;

export function DateSlider({
  minimumDate,
  maximumDate,
  intermediateDate,
  width = 300,
  onChangeCommited,
  bringTheItermediateDateToTheEndDate,
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

  /*
  When you move the minimum thumb selector, you need to store the maximum value 
  and when you move the maximum thumb selector, you need to store the minimum value. 
  To controll slider fill percentage.
  */
  const minPercentageRef = useRef(minimumDateConvertedToMilliseconds);
  const maxPercentageRef = useRef(maximumDateConvertedToMilliseconds);

  //ref fill div to indicate percentage filled
  const range = useRef<HTMLDivElement>(null);

  //ref bubble div to show the date
  const bubbleLeftRef = useRef<HTMLDivElement>(null);
  const bubbleRightRef = useRef<HTMLDivElement>(null);
  const bubbleMidRef = useRef<HTMLDivElement>(null);

  const handlePositionOfThumbBubble = (thumbSide: 'left' | 'mid' | 'right') => {
    if (range.current) {
      const thumbPosition = getThumbPosition({
        inputRangeValue:
          (thumbSide === 'left' && minVal) || (thumbSide === 'mid' && midVal) || (thumbSide === 'right' && maxVal) || 0,
        inputRangeMinValue: minimumDateConvertedToMilliseconds,
        inputRangeMaxValue: maximumDateConvertedToMilliseconds,
      });

      if (thumbSide === 'left' && bubbleLeftRef.current) bubbleLeftRef.current.style.left = thumbPosition;
      if (thumbSide === 'mid' && bubbleMidRef.current) bubbleMidRef.current.style.left = thumbPosition;
      if (thumbSide === 'right' && bubbleRightRef.current) bubbleRightRef.current.style.left = thumbPosition;
    }
  };

  const handleSliderFillPercentage = (thumbSide: 'left' | 'right') => {
    const minPercent = getSliderPercentage({
      inputRangeValue: thumbSide === 'right' ? minPercentageRef.current : minVal,
      inputRangeMinValue: minimumDateConvertedToMilliseconds,
      inputRangeMaxValue: maximumDateConvertedToMilliseconds,
    });

    const maxPercent = getSliderPercentage({
      inputRangeValue: thumbSide === 'left' ? maxPercentageRef.current : maxVal,
      inputRangeMinValue: minimumDateConvertedToMilliseconds,
      inputRangeMaxValue: maximumDateConvertedToMilliseconds,
    });

    if (range.current) {
      if (thumbSide === 'left') range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  };

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

      minPercentageRef.current = minimumDateConvertedToMilliseconds;
      maxPercentageRef.current = maximumDateConvertedToMilliseconds;
    }
  }, [minimumDateConvertedToMilliseconds, maximumDateConvertedToMilliseconds, intermediateDateConvertedToMilliseconds]);

  /**
   * Update bubbles on move input range tooltip
   */
  useEffect(() => {
    handlePositionOfThumbBubble('left');
    handlePositionOfThumbBubble('mid');
    handlePositionOfThumbBubble('right');
  }, [minVal, maxVal, midVal]);

  /**
   * Move mid date to last date
   */
  useEffect(() => {
    //start range mid date
    if (
      !bringTheItermediateDateToTheEndDate ||
      !bringTheItermediateDateToTheEndDate.play ||
      !intermediateDateConvertedToMilliseconds
    )
      return;

    countIntermediateDate = midVal || intermediateDateConvertedToMilliseconds;

    const startAnimation = setInterval(() => {
      countIntermediateDate += dayInMilliseconds;

      if (countIntermediateDate >= maximumDateConvertedToMilliseconds) {
        clearInterval(startAnimation);
        bringTheItermediateDateToTheEndDate.onEnd();
      }

      setMidVal(countIntermediateDate);
      bringTheItermediateDateToTheEndDate.onChangeIntermediateDate?.(formatDateToCallback(countIntermediateDate));
    }, bringTheItermediateDateToTheEndDate.intervalInMilliseconds);

    return () => {
      clearInterval(startAnimation);
    };
  }, [bringTheItermediateDateToTheEndDate?.play]);

  /* ==================== CONTROL OF DIV FILLING ======================== */

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
        minPercentageRef.current = currentMinValue;

        handleSliderFillPercentage('left');
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

        maxPercentageRef.current = currentMaxValue;
        handleSliderFillPercentage('right');
        break;
    }
  };

  /* ===================================================================== */

  //So that nextjs processes the same date as the client on the server and avoids the hydration error. read more: https://nextjs.org/docs/messages/react-hydration-error
  if (!isClient) return null;

  return (
    <div className="flex w-full justify-center" suppressHydrationWarning>
      {Array.from([
        {
          name: EThumbNames.MIN_DATE,
          value: minVal,
          zIndex: minVal >= maxVal ? 70 : 40,
        },
        {
          name: EThumbNames.MID_DATE,
          value: midVal,
          zIndex: midVal && midVal >= maxVal ? 70 : 50,
        },
        {
          name: EThumbNames.MAX_DATE,
          value: maxVal,
          zIndex: 60,
        },
      ]).map((thumb) => {
        if (!thumb.value) return;

        return (
          <ThumbRefComponent
            disabled={!!bringTheItermediateDateToTheEndDate?.play}
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

        {/* bubbles */}
        {Array.from([
          { refName: 'min', value: minVal, ref: bubbleLeftRef, position: 'top' },
          { refName: 'mid', value: midVal, ref: bubbleMidRef, position: 'bottom' },
          { refName: 'max', value: maxVal, ref: bubbleRightRef, position: 'top' },
        ]).map((bubbles, index) => {
          if (!bubbles.value) return;

          return (
            <BubbleWithThumb
              key={index}
              ref={bubbles.ref}
              refName={bubbles.refName}
              value={format(new Date(bubbles.value), 'MMM dd yyyy')}
              position={bubbles.position as BubblePositions}
              playIsActive={!!bringTheItermediateDateToTheEndDate?.play}
            />
          );
        })}
      </div>
    </div>
  );
}
