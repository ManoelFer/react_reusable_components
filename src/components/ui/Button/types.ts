export type TButtonVariants = 'primary';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isLoading?: boolean;
  variant?: TButtonVariants;
}
