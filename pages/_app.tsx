import '../styles/globals.css';
import '../react-frame-datagrid/style.css';
import 'antd/dist/antd.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>React Frame DataGrid</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='React Frame DataGrid example' />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
