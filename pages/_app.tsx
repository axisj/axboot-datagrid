import '../styles/globals.css';
import '../react-frame-table/styles/styles.css';
import 'antd/dist/antd.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
