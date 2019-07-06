import React from 'react';
import styles from './styles.module.scss';
import assets from '../../assets';
import { Link } from 'react-router-dom';

interface Props extends React.HTMLProps<any> {
  icon: string;
  name: string;
  url?: string;
  url_amount?: string;
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

const Provider: React.FC<Props> = ({
  icon,
  name,
  url,
  url_amount,
  permalink,
  amount,
  to,
  ...props
}) => {
  // TODO use button instead of div
  const Wrapper = url ? 'a' : to ? Link : 'div';
  return (
    <Wrapper
      href={url && getUrl(amount ? url_amount : url, permalink, amount)}
      to={to}
      {...props}
    >
      <img src={assets[`${icon}.jpg`]} className={styles.provider} alt={name} />
    </Wrapper>
  );
};

export default Provider;
