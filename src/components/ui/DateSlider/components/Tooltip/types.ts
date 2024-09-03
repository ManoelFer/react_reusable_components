export type TooltipPositions = 'top' | 'bottom';

export interface ITooltipProps {
  value: string;
  position?: TooltipPositions;
}
