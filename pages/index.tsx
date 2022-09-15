import type { NextPage } from 'next';
import Head from 'next/head';
import { Container } from '../styles/Layouts';
import styled from '@emotion/styled';
import BasicExample from '../examples/BasicExample';

const Home: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>react-frame-table</title>
        <meta name='description' content='Index' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Container>
        <h1>Sample</h1>
        <BasicExample />
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 0 20px;
`;

export default Home;
