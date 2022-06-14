import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
// import theme from '../src/theme';

export default class MyDocument extends Document {
  public render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicon-16x16.png"
          />
          <link
            rel="mask-icon"
            href="/static/safari-pinned-tab.svg"
            color="#ea4442"
          />
          <meta name="msapplication-TileColor" content="#282c34" />
          <meta name="theme-color" content="#282c34" />
          <meta
            name="description"
            content="Create your link, setup your accepted payment links, share it and start receiving money. Split a bill with friends or accept payments from customers."
          />
          <link rel="manifest" href="/static/manifest.json" />
          {process.env.NODE_ENV === 'production' &&
            process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                ></script>
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                 window.dataLayer = window.dataLayer || []; function gtag()
                 {
                  dataLayer.push(arguments);
                 }
                 gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
                `,
                  }}
                />
              </>
            )}
        </Head>
        <body style={{ background: '#282c34' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
