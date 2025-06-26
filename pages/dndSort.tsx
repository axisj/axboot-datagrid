import type { NextPage } from 'next';
import { Container } from '../components/Layouts';
import styled from '@emotion/styled';
import BodyRoot from '../components/BodyRoot';
import dynamic from 'next/dynamic';
const Example = dynamic(() => import('../examples/DnDExample'), {
  ssr: false,
});

const dndSort: NextPage = () => {
  return (
    <PageContainer>
      <Container>
        <div>
          <h2>Drag & Drop Sort</h2>
          <Example />
        </div>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled(BodyRoot)``;

export default dndSort;
