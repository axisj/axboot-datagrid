import type { NextPage } from 'next';
import { Container } from '../components/Layouts';
import styled from '@emotion/styled';
import BodyRoot from '../components/BodyRoot';
import dynamic from 'next/dynamic';
import { Spinner } from '../components/Spinner';
const Example = dynamic(() => import('../examples/ColumnsGroupExample'), {
  ssr: false,
  loading: () => <Spinner />,
});

const Sort: NextPage = () => {
  return (
    <PageContainer>
      <Container>
        <div>
          <h2>ColumnsGroup</h2>
          <Example />
        </div>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled(BodyRoot)``;

export default Sort;
