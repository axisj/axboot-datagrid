import * as React from 'react';
import styled from '@emotion/styled';
import TableBody from './TableBody';
import { useAppStore } from '../store';
import TableHead from './TableHead';
import TableHeadFrozen from './TableHeadFrozen';
import TableBodyFrozen from './TableBodyFrozen';

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
  const frozenColumnsWidth = useAppStore(s => s.frozenColumnsWidth);

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
      scrollContainerRef.current.scrollLeft = scrollLeft;
      scrollContainerRef.current.scrollTop = scrollTop;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleScroll]);

  return (
    <Container
      role={'react-frame-table'}
      style={{ width, height, borderWidth: `${containerBorderWidth}px` }}
      className={className}
    >
      <HeaderContainer style={{ height: headerHeight }}>
        {frozenColumnsWidth > 0 && (
          <FrozenHeader
            style={{
              width: frozenColumnsWidth,
            }}
          >
            <TableHeadFrozen />
          </FrozenHeader>
        )}
        <Header style={{ marginLeft: -scrollLeft, paddingLeft: frozenColumnsWidth }}>
          <TableHead />
        </Header>
      </HeaderContainer>

      <ScrollContainer style={{ height: contentBodyHeight }} ref={scrollContainerRef}>
        {frozenColumnsWidth > 0 && (
          <FrozenScrollContent
            style={{
              left: scrollLeft,
              width: frozenColumnsWidth,
              paddingTop: paddingTop,
              height: data.length * trHeight,
            }}
          >
            <TableBodyFrozen />
          </FrozenScrollContent>
        )}
        <ScrollContent
          style={{
            paddingLeft: frozenColumnsWidth,
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

const FrozenHeaderContainer = styled.div``;

const HeaderContainer = styled.div`
  background: var(--rft-header-bg);
  position: relative;
  min-width: 100%;
  border-bottom: 1px solid var(--rft-border-color-base);
  overflow: hidden;
`;
const Header = styled.div`
  table {
    height: 100%;
  }
`;
const FrozenHeader = styled.div`
  position: absolute;

  table {
    height: 100%;
  }
`;
const ScrollContainer = styled.div`
  position: relative;
  overflow: auto;
`;
const ScrollContent = styled.div`
  position: absolute;
  min-width: 100%;
`;
const FrozenScrollContent = styled.div`
  position: absolute;
`;

export default Table;
