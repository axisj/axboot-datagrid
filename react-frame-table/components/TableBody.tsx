import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import TableBodyTr from './TableBodyTr';

interface Props {}

function TableBody(props: Props) {
  const contentBodyHeight = useAppStore(s => s.contentBodyHeight);
  const scrollTop = useAppStore(s => s.scrollTop);
  const trHeight = useAppStore(s => s.trHeight);
  const displayItemCount = useAppStore(s => s.displayItemCount);
  const data = useAppStore(s => s.data);
  const setScrollTop = useAppStore(s => s.setScrollTop);
  const setScrollLeft = useAppStore(s => s.setScrollLeft);

  const startIdx = Math.floor(scrollTop / trHeight);
  const endNumber = startIdx + displayItemCount > data.length ? data.length : startIdx + displayItemCount;
  const paddingTop = startIdx * trHeight;

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const ref = scrollContainerRef.current;
      setScrollTop(ref.scrollTop);
      setScrollLeft(ref.scrollLeft);
    }
  }, [setScrollLeft, setScrollTop]);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    }
  }, [handleScroll]);

  return (
    <ScrollContainer style={{ height: contentBodyHeight }} ref={scrollContainerRef}>
      <ScrollContent
        trHeight={trHeight}
        borderWidth={1}
        style={{
          paddingTop,
          height: data.length * trHeight,
        }}
      >
        <BodyTable>
          {Array.from({ length: endNumber - startIdx }, (_, i) => {
            const ri = startIdx + i;
            const item = data[ri];
            if (!item) {
              return null;
            }

            return <TableBodyTr key={ri} />;
          })}
        </BodyTable>
      </ScrollContent>
    </ScrollContainer>
  );
}

const ScrollContainer = styled.div`
  position: relative;
  overflow: auto;
`;
const ScrollContent = styled.div<{ trHeight: number; borderWidth: number }>`
  position: absolute;
  min-width: 100%;

  ${({ trHeight, borderWidth }) =>
    `background: repeating-linear-gradient(to bottom, transparent 0 ${
      trHeight - borderWidth
    }px, var(--rft-border-color-base) ${trHeight - borderWidth}px ${trHeight}px);`}
`;
const BodyTable = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;

export default TableBody;
