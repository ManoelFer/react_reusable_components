export interface IActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  action: (data: FormData) => void;
  actionKey: string;
  actionValue: string | number | readonly string[];
}
