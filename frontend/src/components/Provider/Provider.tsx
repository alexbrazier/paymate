import React from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';

interface Props extends React.HTMLProps<any> {
  icon: string;
  name: string;
  url?: string;
  urlAmount?: string;
  permalink?: string;
  amount?: string;
  to?: any;
  onClick?: any;
}

const replacePlaceholder = (
  input: string,
  placeholder: string,
  value: string
) => input.replace(`{{${placeholder}}}`, value);

const getUrl = (url: string, permalink: string, amount?: string) => {
  const replacedUrl = replacePlaceholder(url, 'NAME', permalink);
  if (amount) {
    return replacePlaceholder(replacedUrl, 'AMOUNT', amount);
  }
  return replacedUrl;
};

const CustomLink = ({ to, children, ...props }) => (
  <Link href={to} legacyBehavior>
    <a {...props}>{children}</a>
  </Link>
);

const Provider: React.FC<Props> = ({
  icon,
  name,
  url,
  urlAmount,
  permalink,
  amount,
  to,
  ...props
}) => {
  // TODO use button instead of div
  const Wrapper = url ? 'a' : to ? CustomLink : 'div';
  return (
    <Wrapper
      href={
        url && getUrl(amount && urlAmount ? urlAmount : url, permalink, amount)
      }
      to={to}
      {...props}
    >
      <img
        src={`/providers/${icon}${icon.includes('.') ? '' : '.jpg'}`}
        className={styles.provider}
        style={{ cursor: url || to || props.onClick ? 'pointer' : 'default' }}
        alt={name}
      />
    </Wrapper>
  );
};

export default Provider;
