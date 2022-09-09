import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';

interface Props {}

function TableBody(props: Props) {
  const [height, headerHeight, containerBorderWidth] = useAppStore(s => [
    s.height,
    s.headerHeight,
    s.containerBorderWidth,
  ]);
  const bodyHeight = React.useMemo(
    () => height - headerHeight - containerBorderWidth * 2,
    [headerHeight, height, containerBorderWidth],
  );
  return (
    <>
      <ScrollContainer style={{ height: bodyHeight }}>
        <div style={{ width: 1000, height: 1000 }} />
      </ScrollContainer>
    </>
  );
}

const ScrollContainer = styled.div`
  overflow: auto;
`;

export default TableBody;
