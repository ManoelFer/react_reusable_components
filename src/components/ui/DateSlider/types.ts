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
