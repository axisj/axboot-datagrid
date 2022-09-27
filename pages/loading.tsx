import type { NextPage } from 'next';
import Head from 'next/head';
import { Container } from '../components/Layouts';
import styled from '@emotion/styled';
import SortExample from '../examples/SortExample';
import LoadingExample from '../examples/LoadingExample';
import BodyRoot from '../components/BodyRoot';

const Loading: NextPage = () => {
  return (
    <PageContainer>
      <Container>
        <div>
          <h2>Loading</h2>
          <LoadingExample />
        </div>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled(BodyRoot)``;

export default Loading;
