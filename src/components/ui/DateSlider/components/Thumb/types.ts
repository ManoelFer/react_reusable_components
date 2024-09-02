export interface IThumbProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value: number;
  min: number;
  max: number;
}
