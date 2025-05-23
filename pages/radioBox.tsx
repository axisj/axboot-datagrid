import type { NextPage } from 'next';
import { Container } from '../components/Layouts';
import styled from '@emotion/styled';
import BodyRoot from '../components/BodyRoot';
import dynamic from 'next/dynamic';

const Example = dynamic(() => import('../examples/CheckedExample'), {
  ssr: false,
});

const RadioBox: NextPage = () => {
  return (
    <PageContainer>
      <Container>
        <div>
          <h2>Radio Checkbox</h2>
          <Example />
        </div>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled(BodyRoot)``;

export default RadioBox;
