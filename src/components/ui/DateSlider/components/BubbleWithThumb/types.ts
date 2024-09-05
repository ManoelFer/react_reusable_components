export type BubblePositions = 'top' | 'bottom';

export interface IBubbleProps {
  value: string;
  position?: BubblePositions;
  playIsActive?: boolean;
  refName: string;
}
