interface DatesCallback {
  minDateSelected: string;
  maxDateSelected: string;
}

export interface IDateSliderProps {
  minimumDate: Date;
  maximumDate: Date;
  width?: number;
  onChangeCommited?: (callback: DatesCallback) => void;
}
