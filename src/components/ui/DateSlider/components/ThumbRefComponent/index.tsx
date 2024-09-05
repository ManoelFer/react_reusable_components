import { IThumbProps } from './types';

import './thumb.css';

export function ThumbRefComponent(props: IThumbProps) {
  //DON'T EDIT THE THUMB OR SLIDER HERE, IT'S A REFERENCE COMPONENT ONLY. USE THE BubbleWithThumb COMPONENT INSTEAD OF THIS ONE.
  return <input {...props} type="range" className={`thumb pointer-events-none absolute h-0`} />;
}
