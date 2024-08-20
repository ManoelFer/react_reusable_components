import { ISVGProps } from '@/types/svg';

import { ErrorIcon } from './ErrorIcon';

const icons = {
  error: (props: ISVGProps) => <ErrorIcon {...props} />,
};

interface IIconProps extends ISVGProps {
  name: keyof typeof icons;
}

export const Icons = ({ name, ...rest }: IIconProps) => {
  if (!name) return null;

  return icons[name]({ ...rest });
};
