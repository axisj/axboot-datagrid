import type { NextPage } from 'next';
import Head from 'next/head';
import { Container } from '../components/Layouts';
import styled from '@emotion/styled';
import ColumnsGroupExample from '../examples/ColumnsGroupExample';
import BodyRoot from '../components/BodyRoot';

const Sort: NextPage = () => {
  return (
    <PageContainer>
      <Container>
        <div>
          <h2>ColumnsGroup</h2>
          <ColumnsGroupExample />
        </div>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled(BodyRoot)``;

export default Sort;
