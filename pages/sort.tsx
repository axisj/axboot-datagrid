import type { NextPage } from 'next';
import Head from 'next/head';
import { Container } from '../components/Layouts';
import styled from '@emotion/styled';
import SortExample from '../examples/SortExample';

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
          <h2>Sort</h2>
          <SortExample />
        </div>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 20px;
`;

export default Sort;
