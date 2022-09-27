import type { NextPage } from 'next';
import Head from 'next/head';
import { Container } from '../components/Layouts';
import styled from '@emotion/styled';
import PagingExample from '../examples/PagingExample';
import BodyRoot from '../components/BodyRoot';

const Sort: NextPage = () => {
  return (
    <PageContainer>
      <Container>
        <div>
          <h2>Paging</h2>
          <PagingExample />
        </div>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled(BodyRoot)``;

export default Sort;
