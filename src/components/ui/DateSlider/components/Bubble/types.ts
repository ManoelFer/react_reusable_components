export type BubblePositions = 'top' | 'bottom';

export interface IBubbleProps {
  value: string;
  position?: BubblePositions;
}
