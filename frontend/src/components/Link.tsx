import React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import MuiLink, { LinkProps } from '@mui/material/Link';

type Props = NextLinkProps;

const NextComposed = React.forwardRef<any, Props>(
  ({ as, href, ...rest }, ref) => (
    <NextLink href={href} as={as} legacyBehavior passHref>
      <a {...rest} ref={ref} />
    </NextLink>
  )
);

NextComposed.displayName = 'NextComposed';

interface LProps extends LinkProps {
  children: any;
  className?: string;
  href: string;
  external?: boolean;
}

const Link: React.FC<LProps> = ({ href, className, external, ...rest }) => {
  return (
    <MuiLink
      {...(external ? {} : { component: NextComposed })}
      className={className}
      href={href}
      {...rest}
    />
  );
};

export default Link;
