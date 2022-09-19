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
  const setScroll = useAppStore(s => s.setScroll);
  const trHeight = itemHeight + itemPadding * 2 + 1;
  const paddingTop = Math.floor(scrollTop / trHeight) * trHeight;
  const frozenColumnsWidth = useAppStore(s => s.frozenColumnsWidth);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const frozenScrollContainerRef = React.useRef<HTMLDivElement>(null);

  const onScroll = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollLeft } = scrollContainerRef.current;
      setScroll(scrollTop, scrollLeft);
    }
  }, [setScroll]);

  const onWheel: (this: HTMLDivElement, ev: HTMLElementEventMap['wheel']) => any = React.useCallback(evt => {
    evt.preventDefault();

    if (scrollContainerRef.current) {
      const delta = { x: 0, y: 0 };

      if ((evt as any).detail) {
        delta.y = (evt as any).detail * 10;
      } else {
        if (typeof evt.deltaY === 'undefined') {
          delta.y = -(evt as any).wheelDelta;
          delta.x = 0;
        } else {
          delta.y = evt.deltaY;
          delta.x = evt.deltaX;
        }
      }

      // scrollContainerRef.current.scrollLeft = scrollLeft + delta.x;
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollTop + delta.y;
    }
  }, []);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current?.removeEventListener('scroll', onScroll);
      scrollContainerRef.current.addEventListener('scroll', onScroll, { passive: true, capture: true });
      scrollContainerRef.current.scrollLeft = scrollLeft;
      scrollContainerRef.current.scrollTop = scrollTop;
    }

    if (frozenScrollContainerRef.current) {
      scrollContainerRef.current?.removeEventListener('wheel', onWheel);
      frozenScrollContainerRef.current.addEventListener('wheel', onWheel);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      scrollContainerRef.current?.removeEventListener('wheel', onWheel);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      scrollContainerRef.current?.removeEventListener('scroll', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onScroll]);

  return (
    <Container
      role={'react-frame-table'}
      style={{ width, height, borderWidth: `${containerBorderWidth}px` }}
      className={className}
    >
      <HeaderContainer style={{ height: headerHeight }} role={'react-frame-table-header-container'}>
        {frozenColumnsWidth > 0 && (
          <FrozenHeader
            style={{
              width: frozenColumnsWidth,
            }}
            role={'react-frame-table-frozen-header'}
          >
            <TableHeadFrozen />
          </FrozenHeader>
        )}
        <Header style={{ marginLeft: -scrollLeft, paddingLeft: frozenColumnsWidth }} role={'react-frame-table-header'}>
          <TableHead />
        </Header>
      </HeaderContainer>

      <BodyContainer style={{ height: contentBodyHeight }}>
        {frozenColumnsWidth > 0 && (
          <FrozenScrollContent
            ref={frozenScrollContainerRef}
            style={{
              width: frozenColumnsWidth,
            }}
            role={'react-frame-table-frozen-scroll-container'}
          >
            <TableBodyFrozen
              style={{
                marginTop: -scrollTop % trHeight,
              }}
            />
          </FrozenScrollContent>
        )}
        <ScrollContainer ref={scrollContainerRef} role={'react-frame-table-scroll-container'}>
          <ScrollContent
            style={{
              paddingTop: paddingTop,
              height: data.length * trHeight,
            }}
          >
            <TableBody />
          </ScrollContent>
        </ScrollContainer>
      </BodyContainer>
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
  overflow: hidden;
`;

const Header = styled.div`
  z-index: 1;
`;

const FrozenHeader = styled.div`
  position: absolute;
  background-color: var(--rft-header-bg);
  border-right: 1px solid var(--rft-border-color-base);
  box-shadow: 0 0 3px var(--rft-border-color-base);
  z-index: 2;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
  background-color: var(--rft-scroll-track-bg);
`;

const ScrollContainer = styled.div`
  position: relative;
  overflow: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: var(--rft-scroll-size);
    height: var(--rft-scroll-size);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--rft-scroll-thumb-bg);
    border-radius: var(--rft-scroll-thumb-radius);
    border: 2px solid var(--rft-scroll-track-bg);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--rft-scroll-thumb-hover-bg);
    border: 1px solid var(--rft-scroll-track-bg);
  }

  &::-webkit-scrollbar-track {
    background-color: var(--rft-scroll-track-bg);
  }

  &::-webkit-scrollbar-track:vertical {
    background-color: var(--rft-scroll-track-bg);
  }

  &::-webkit-scrollbar-track:horizontal {
    background-color: var(--rft-scroll-track-bg);
  }

  &::-webkit-scrollbar-corner {
    background-color: var(--rft-scroll-track-corner-bg);
  }
`;

const ScrollContent = styled.div`
  position: absolute;
  min-width: 100%;
  z-index: 1;
`;

const FrozenScrollContent = styled.div`
  flex: none;
  border-right: 1px solid var(--rft-border-color-base);
  box-shadow: 0 0 3px var(--rft-border-color-base);
  z-index: 2;
  overflow: hidden;
  position: relative;
`;

export default Table;
