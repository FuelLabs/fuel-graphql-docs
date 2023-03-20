import type { LinkProps } from '@fuel-ui/react';
import { Link as FuelLink } from '@fuel-ui/react';
import { cssObj } from '@fuel-ui/css';

export function Link(props: LinkProps) {
  return <FuelLink {...props} css={style} isExternal />;
}

const style = cssObj({
  color: "#00F58C !important"
})
