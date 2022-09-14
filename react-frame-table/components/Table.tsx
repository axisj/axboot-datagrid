import * as React from 'react';
import styled from '@emotion/styled';
import TableBody from './TableBody';
import { useAppStore } from '../store';
import TableHead from './TableHead';

function Table() {
  const width = useAppStore(s => s.width);
  const height = useAppStore(s => s.height);
  const containerBorderWidth = useAppStore(s => s.containerBorderWidth);
  const className = useAppStore(s => s.className);
  const itemHeight = useAppStore(s => s.itemHeight);
  const itemPadding = useAppStore(s => s.itemPadding);

  const headerHeight = useAppStore(s => s.headerHeight);
  const scrollLeft = useAppStore(s => s.scrollLeft);
  const scrollTop = useAppStore(s => s.scrollTop);
  const contentBodyHeight = useAppStore(s => s.contentBodyHeight);
  const data = useAppStore(s => s.data);
  const setScrollTop = useAppStore(s => s.setScrollTop);
  const setScrollLeft = useAppStore(s => s.setScrollLeft);
  const trHeight = itemHeight + itemPadding * 2;
  const paddingTop = Math.floor(scrollTop / trHeight) * trHeight;

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
    <Container
      role={'react-frame-table'}
      style={{ width, height, borderWidth: `${containerBorderWidth}px` }}
      className={className}
    >
      <HeaderContainer style={{ height: headerHeight }}>
        <Header style={{ marginLeft: -scrollLeft }}>
          <TableHead />
        </Header>
      </HeaderContainer>
      <ScrollContainer style={{ height: contentBodyHeight }} ref={scrollContainerRef}>
        <ScrollContent
          trHeight={trHeight}
          borderWidth={1}
          style={{
            paddingTop: paddingTop,
            height: data.length * trHeight,
          }}
        >
          <TableBody />
        </ScrollContent>
      </ScrollContainer>
    </Container>
  );
}

const Container = styled.div`
  border-color: var(--rft-border-color-base);
  border-style: solid;
  box-sizing: border-box;
  position: relative;
`;

const HeaderContainer = styled.div`
  background: var(--rft-header-bg);
  position: relative;
  min-width: 100%;
  left: 0;
  border-bottom: 1px solid var(--rft-border-color-base);
  overflow: hidden;
`;
const Header = styled.div`
  table {
    height: 100%;
  }
`;
const ScrollContainer = styled.div`
  position: relative;
  overflow: auto;
`;
const ScrollContent = styled.div<{ trHeight: number; borderWidth: number }>`
  position: absolute;
  min-width: 100%;
`;

export default Table;
