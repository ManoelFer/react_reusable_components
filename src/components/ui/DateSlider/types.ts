interface DatesCallback {
  minDateSelected: string;
  midDateSelected?: string;
  maxDateSelected: string;
}

export interface IDateSliderProps {
  minimumDate: Date;
  maximumDate: Date;
  intermediateDate?: Date;
  width?: number;
  onChangeCommited?: (callback: DatesCallback) => void;
}

export enum EThumbNames {
  MIN_DATE = 'min-date',
  MID_DATE = 'mid-date',
  MAX_DATE = 'max-date',
}
