import { Container } from '../components/Layouts';
import styled from '@emotion/styled';
import BodyRoot from '../components/BodyRoot';
import dynamic from 'next/dynamic';
const Example = dynamic(() => import('../examples/PagingExample'), {
  ssr: false,
});

export default function Paging() {
  return (
    <PageContainer>
      <Container>
        <div>
          <h2>Paging</h2>
          <Example />
        </div>
      </Container>
    </PageContainer>
  );
}

const PageContainer = styled(BodyRoot)``;
