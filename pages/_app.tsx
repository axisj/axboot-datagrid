import '../styles/globals.css';
import '../@axboot-datagrid/style.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>@axboot/datagrid</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='React DataGrid example - npm i @axboot/datagrid' />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
