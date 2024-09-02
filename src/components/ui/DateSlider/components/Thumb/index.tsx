import './thumb.css';
import { IThumbProps } from './types';

export function Thumb(props: IThumbProps) {
  return <input {...props} type="range" className={`thumb pointer-events-none absolute h-0`} />;
}
