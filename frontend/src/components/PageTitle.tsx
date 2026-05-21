import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface Props {
  title?: string;
  description?: string;
  noindex?: boolean;
}

const siteName = 'PayMate';
const siteUrl = 'https://paymate.me';
const defaultDescription =
  'Create one PayMate.me link for the payment providers you already use, then share it with friends and family.';

const PageTitle: React.FC<Props> = ({ title, description, noindex }) => {
  const router = useRouter();
  const finalTitle = title
    ? `${title} | ${siteName}`
    : `${siteName} | Get paid your way with one simple link`;
  const finalDescription = description || defaultDescription;
  const path = router.asPath.split('?')[0].split('#')[0] || '/';
  const canonical = `${siteUrl}${path === '/' ? '' : path}`;

  return (
    <Head>
      <title>{finalTitle}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
        key="viewport"
      />
      <meta name="title" content={finalTitle} key="title" />
      <meta name="description" content={finalDescription} key="description" />
      <meta
        name="robots"
        content={noindex ? 'noindex,nofollow' : 'index,follow'}
        key="robots"
      />
      <link rel="canonical" href={canonical} key="canonical" />
      <meta property="og:site_name" content={siteName} key="og:site_name" />
      <meta property="og:title" content={finalTitle} key="og:title" />
      <meta
        property="og:description"
        content={finalDescription}
        key="og:description"
      />
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:url" content={canonical} key="og:url" />
      <meta
        property="og:image"
        content={`${siteUrl}/android-chrome-256x256.png`}
        key="og:image"
      />
      <meta name="twitter:card" content="summary" key="twitter:card" />
      <meta name="twitter:title" content={finalTitle} key="twitter:title" />
      <meta
        name="twitter:description"
        content={finalDescription}
        key="twitter:description"
      />
    </Head>
  );
};

export default PageTitle;
