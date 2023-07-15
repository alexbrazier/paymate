import React from 'react';
import Head from 'next/head';

interface Props {
  title: string;
  description?: string;
}

const PageTitle: React.FC<Props> = ({ title, description }) => {
  const finalTitle = title ? `Paymate - ${title}` : 'Paymate';

  return (
    <Head>
      <title>{finalTitle}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
        key="viewport"
      />
      <meta name="title" content={finalTitle} key="title" />
      {description && (
        <meta name="description" content={description} key="description" />
      )}
    </Head>
  );
};

export default PageTitle;
