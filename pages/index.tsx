import type {NextPage} from 'next';
import Head from 'next/head';
import {Container} from '../styles/Layouts';
import dynamic from 'next/dynamic';
import styled from '@emotion/styled';

const DBasicExample = dynamic(() => import('../examples/BasicExample'), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>react-frame-table</title>
        <meta name='description' content='Index'/>
        <link rel='icon' href='/favicon.ico'/>
      </Head>

      <Container>
        <h1>Sample</h1>
        <DBasicExample/>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 0 20px;
`;

export default Home;
