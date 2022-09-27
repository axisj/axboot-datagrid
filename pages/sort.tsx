import type { NextPage } from 'next';
import Head from 'next/head';
import { Container } from '../components/Layouts';
import styled from '@emotion/styled';
import SortExample from '../examples/SortExample';
import BodyRoot from '../components/BodyRoot';

const Sort: NextPage = () => {
  return (
    <PageContainer>
      <Container>
        <div>
          <h2>Sort</h2>
          <SortExample />
        </div>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled(BodyRoot)``;

export default Sort;
