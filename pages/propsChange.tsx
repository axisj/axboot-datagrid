import type { NextPage } from 'next';
import Head from 'next/head';
import { Container } from '../components/Layouts';
import styled from '@emotion/styled';
import SortExample from '../examples/SortExample';
import LoadingExample from '../examples/LoadingExample';
import PropsChangeExample from '../examples/PropsChangeExample';

const PropsChange: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>react-frame-table</title>
        <meta name='description' content='Index' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Container>
        <div>
          <h1>Props Change</h1>
          <PropsChangeExample />
        </div>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 20px;
`;

export default PropsChange;
