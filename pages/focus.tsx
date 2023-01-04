import { Container } from '../components/Layouts';
import styled from '@emotion/styled';
import BodyRoot from '../components/BodyRoot';
import FocusExample from '../examples/FocusExample';

export default function Focus() {
  return (
    <PageContainer>
      <Container>
        <div>
          <h2>Focus</h2>
          <FocusExample />
        </div>
      </Container>
    </PageContainer>
  );
}

const PageContainer = styled(BodyRoot)``;
