'use client';

import { DateSlider } from '@/components/ui/DateSlider';

import { addMonths, subMonths } from 'date-fns';

const currentDate = new Date();

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-20 pt-20">
      <h1 className="text-white">Import bellow the component to tests!</h1>

      <DateSlider
        minimumDate={subMonths(currentDate, 7)}
        maximumDate={addMonths(currentDate, 3)}
        intermediateDate={currentDate}
        onChangeCommited={(values) => console.log('values', values)}
      />
    </div>
  );
}
