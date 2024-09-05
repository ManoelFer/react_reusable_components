import { format } from 'date-fns';

export const dayInMilliseconds = 86400000;

export const formatDateToCallback = (dateInMilliseconds: number) =>
  format(new Date(Number(dateInMilliseconds)), 'MM-dd-yyyy');

export const getSliderPercentage = ({
  inputRangeValue,
  inputRangeMinValue,
  inputRangeMaxValue,
}: {
  inputRangeValue: number;
  inputRangeMinValue: number;
  inputRangeMaxValue: number;
}) => Math.round(((inputRangeValue - inputRangeMinValue) / (inputRangeMaxValue - inputRangeMinValue)) * 100);

export const getThumbPosition = ({
  inputRangeValue,
  inputRangeMinValue,
  inputRangeMaxValue,
}: {
  inputRangeValue: number;
  inputRangeMinValue: number;
  inputRangeMaxValue: number;
}) => {
  const percentage = getSliderPercentage({ inputRangeMaxValue, inputRangeMinValue, inputRangeValue });

  return `calc(${percentage}% + (${-3 - percentage * 0.15}px))`;
};
