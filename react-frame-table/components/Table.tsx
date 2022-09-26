import * as React from 'react';
import styled from '@emotion/styled';
import TableBody from './TableBody';
import { useAppStore } from '../store';
import TableHead from './TableHead';
import TableHeadFrozen from './TableHeadFrozen';
import TableBodyFrozen from './TableBodyFrozen';
import TableFooter from './TableFooter';
import Loading from './Loading';

interface Props {
  width?: number;
  height?: number;
  loading?: boolean;
  spinning?: boolean;
  scrollTop?: number;
  scrollLeft?: number;

  headerHeight?: number;
  footerHeight?: number;
  itemHeight?: number;
  itemPadding?: number;
  frozenColumnIndex?: number;
}

function Table(props: Props) {
  const setInitialized = useAppStore(s => s.setInitialized);
  const width = useAppStore(s => s.width);
  const height = useAppStore(s => s.height);
  const containerBorderWidth = useAppStore(s => s.containerBorderWidth);
  const className = useAppStore(s => s.className);
  const itemHeight = useAppStore(s => s.itemHeight);
  const itemPadding = useAppStore(s => s.itemPadding);

  const headerHeight = useAppStore(s => s.headerHeight);
  const footerHeight = useAppStore(s => s.footerHeight);
  const scrollLeft = useAppStore(s => s.scrollLeft);
  const scrollTop = useAppStore(s => s.scrollTop);
  const contentBodyHeight = useAppStore(s => s.contentBodyHeight);
  const data = useAppStore(s => s.data);
  const setScroll = useAppStore(s => s.setScroll);
  const trHeight = itemHeight + itemPadding * 2 + 1;
  const paddingTop = Math.floor(scrollTop / trHeight) * trHeight;
  const frozenColumnsWidth = useAppStore(s => s.frozenColumnsWidth);
  const page = useAppStore(s => s.page);
  const loading = useAppStore(s => s.loading);
  const spinning = useAppStore(s => s.spinning);

  const setHeight = useAppStore(s => s.setHeight);
  const setContentBodyHeight = useAppStore(s => s.setContentBodyHeight);
  const setDisplayItemCount = useAppStore(s => s.setDisplayItemCount);
  const setWidth = useAppStore(s => s.setWidth);
  const setLoading = useAppStore(s => s.setLoading);
  const setSpinning = useAppStore(s => s.setSpinning);

  const setHeaderHeight = useAppStore(s => s.setHeaderHeight);
  const setFooterHeight = useAppStore(s => s.setFooterHeight);
  const setItemHeight = useAppStore(s => s.setItemHeight);
  const setItemPadding = useAppStore(s => s.setItemPadding);
  const setFrozenColumnIndex = useAppStore(s => s.setFrozenColumnIndex);

  const containerRef = React.useRef<HTMLDivElement>(null);
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

      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollTop + delta.y;
    }
  }, []);

  React.useEffect(() => {
    if (props.height !== undefined) {
      setHeight(props.height);
      const contentBodyHeight = height - headerHeight - (page ? footerHeight : 0) - containerBorderWidth * 2;
      const displayItemCount = Math.ceil(contentBodyHeight / (itemHeight + itemPadding * 2));

      setContentBodyHeight(contentBodyHeight);
      setDisplayItemCount(displayItemCount);
    }
  }, [
    setHeight,
    props.height,
    height,
    headerHeight,
    page,
    footerHeight,
    containerBorderWidth,
    itemHeight,
    itemPadding,
    setContentBodyHeight,
    setDisplayItemCount,
  ]);

  React.useEffect(() => {
    if (props.width !== undefined) setWidth(props.width);
  }, [setWidth, props.width]);
  React.useEffect(() => {
    if (props.loading !== undefined) setLoading(props.loading);
  }, [setLoading, props.loading]);
  React.useEffect(() => {
    if (props.spinning !== undefined) setSpinning(props.spinning);
  }, [setSpinning, props.spinning]);
  React.useEffect(() => {
    if (props.headerHeight !== undefined) setHeaderHeight(props.headerHeight);
  }, [setHeaderHeight, props.headerHeight]);
  React.useEffect(() => {
    if (props.footerHeight !== undefined) setFooterHeight(props.footerHeight);
  }, [setFooterHeight, props.footerHeight]);
  React.useEffect(() => {
    if (props.itemHeight !== undefined) setItemHeight(props.itemHeight);
  }, [setItemHeight, props.itemHeight]);
  React.useEffect(() => {
    if (props.itemPadding !== undefined) setItemPadding(props.itemPadding);
  }, [setItemPadding, props.itemPadding]);
  React.useEffect(() => {
    if (props.frozenColumnIndex !== undefined) setFrozenColumnIndex(props.frozenColumnIndex);
  }, [setFrozenColumnIndex, props.frozenColumnIndex]);

  //setInitialized
  React.useEffect(() => {
    setInitialized(true);

    const scrollContainerRefCurrent = scrollContainerRef?.current;
    const frozenScrollContainerRefCurrent = frozenScrollContainerRef?.current;
    if (scrollContainerRefCurrent) {
      scrollContainerRefCurrent.removeEventListener('scroll', onScroll);
      scrollContainerRefCurrent.addEventListener('scroll', onScroll, { passive: true, capture: true });
      scrollContainerRefCurrent.scrollLeft = props.scrollLeft ?? scrollLeft;
      scrollContainerRefCurrent.scrollTop = props.scrollTop ?? scrollTop;
    }

    if (frozenScrollContainerRefCurrent) {
      frozenScrollContainerRefCurrent.removeEventListener('wheel', onWheel);
      frozenScrollContainerRefCurrent.addEventListener('wheel', onWheel);
    }

    return () => {
      scrollContainerRefCurrent?.removeEventListener('scroll', onScroll);
      frozenScrollContainerRefCurrent?.removeEventListener('wheel', onWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.scrollTop, props.scrollLeft]);

  return (
    <Container
      ref={containerRef}
      role={'react-frame-table'}
      style={{ width, height, borderWidth: `${containerBorderWidth}px` }}
      className={className}
    >
      <HeaderContainer style={{ height: headerHeight }} role={'rft-header-container'}>
        {frozenColumnsWidth > 0 && (
          <FrozenHeader
            style={{
              width: frozenColumnsWidth,
            }}
            role={'rft-frozen-header'}
          >
            <TableHeadFrozen container={containerRef} />
          </FrozenHeader>
        )}
        <Header style={{ marginLeft: -scrollLeft, paddingLeft: frozenColumnsWidth }} role={'rft-header'}>
          <TableHead container={containerRef} />
        </Header>
      </HeaderContainer>

      <BodyContainer style={{ height: contentBodyHeight }}>
        {frozenColumnsWidth > 0 && (
          <FrozenScrollContent
            ref={frozenScrollContainerRef}
            style={{
              width: frozenColumnsWidth,
            }}
            role={'rft-frozen-scroll-container'}
          >
            <TableBodyFrozen
              style={{
                marginTop: -scrollTop % trHeight,
              }}
            />
          </FrozenScrollContent>
        )}
        <ScrollContainer ref={scrollContainerRef} role={'rft-scroll-container'}>
          <ScrollContent
            style={{
              paddingTop: paddingTop,
              height: data.length * trHeight,
            }}
          >
            <TableBody />
          </ScrollContent>
        </ScrollContainer>

        <Loading active={!!spinning} size={'small'} />
      </BodyContainer>

      {page && (
        <FooterContainer style={{ height: footerHeight }} role={'rft-footer-container'}>
          <TableFooter />
        </FooterContainer>
      )}
      <Loading active={!!loading} />
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
  z-index: 3;
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

const FooterContainer = styled.div`
  position: relative;
  min-width: 100%;
  overflow: hidden;
  background: var(--rft-footer-bg);
  border-top: 1px solid var(--rft-border-color-base);
`;

export default Table;
