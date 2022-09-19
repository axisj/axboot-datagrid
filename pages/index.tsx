import type { NextPage } from 'next';
import Head from 'next/head';
import { Container } from '../styles/Layouts';
import styled from '@emotion/styled';
import BasicExample from '../examples/BasicExample';
import ColumnsGroupExample from '../examples/ColumnsGroupExample';

const Home: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>react-frame-table</title>
        <meta name='description' content='Index' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Container>
        <div>
          <h1>Basic</h1>
          <BasicExample />
        </div>

        <h1>ColumnsGroup</h1>
        <ColumnsGroupExample />
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 20px;
`;

export default Home;
