'use client';

import { Button } from '@/components/ui';
import { DateSlider } from '@/components/ui/DateSlider';

import { addMonths, subMonths } from 'date-fns';
import { useState } from 'react';

const currentDate = new Date();

export default function Home() {
  const [play, setPlay] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center gap-20 pt-20">
      <h1 className="text-white">Import bellow the component to tests!</h1>

      <DateSlider
        minimumDate={subMonths(currentDate, 7)}
        maximumDate={addMonths(currentDate, 3)}
        intermediateDate={currentDate}
        bringTheItermediateDateToTheEndDate={{
          play,
          onChangeIntermediateDate: (currentIntermediateDate) =>
            console.log('currentIntermediateDate', currentIntermediateDate),
          onEnd: () => setPlay(false),
          intervalInMilliseconds: 1000,
        }}
        onChangeCommited={(values) => console.log('values', values)}
      />

      <Button label={play ? 'Pause' : 'Play'} onClick={() => setPlay(!play)} />
    </div>
  );
}
