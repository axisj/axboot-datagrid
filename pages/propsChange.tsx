import type { NextPage } from 'next';
import Head from 'next/head';
import { Container } from '../components/Layouts';
import styled from '@emotion/styled';
import SortExample from '../examples/SortExample';
import LoadingExample from '../examples/LoadingExample';
import PropsChangeExample from '../examples/PropsChangeExample';
import BodyRoot from '../components/BodyRoot';

const PropsChange: NextPage = () => {
  return (
    <PageContainer>
      <Container>
        <div>
          <h2>Props Change</h2>
          <PropsChangeExample />
        </div>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled(BodyRoot)``;

export default PropsChange;
