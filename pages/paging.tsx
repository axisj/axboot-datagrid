import type { NextPage } from 'next';
import Head from 'next/head';
import { Container } from '../components/Layouts';
import styled from '@emotion/styled';
import PagingExample from '../examples/PagingExample';

const Sort: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>react-frame-datagrid</title>
        <meta name='description' content='Index' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Container>
        <div>
          <h2>Paging</h2>
          <PagingExample />
        </div>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 20px;
`;

export default Sort;
