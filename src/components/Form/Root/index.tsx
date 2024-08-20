import React, { LegacyRef } from 'react';

import { IRootProps } from './types';

const Root = React.forwardRef(({ children, ...rest }: IRootProps, ref: LegacyRef<HTMLFormElement>) => (
  <form ref={ref} {...rest}>
    {children}
  </form>
));

export default Root;
