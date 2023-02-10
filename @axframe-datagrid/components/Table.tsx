import * as React from 'react';
import styled from '@emotion/styled';
import TableBody from './TableBody';
import { useAppStore } from '../store';
import TableHead from './TableHead';
import TableHeadFrozen from './TableHeadFrozen';
import TableBodyFrozen from './TableBodyFrozen';
import TableFooter from './TableFooter';
import Loading from './Loading';
import { AXFDGColumn, AXFDGColumnGroup, AXFDGDataItem, AXFDGPage, AXFDGProps, AXFDGSortParam } from '../types';
import { getFrozenColumnsWidth } from '../utils';
import { css } from '@emotion/react';

interface Props<T> {
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

  checkedIndexesMap: Map<number, any>;
  sortParams?: Record<string, AXFDGSortParam>;
  columns: AXFDGColumn<T>[];
  columnsGroup: AXFDGColumnGroup[];
  page?: AXFDGPage;
  data?: AXFDGDataItem<T>[];
  onClick?: AXFDGProps<T>['onClick'];
  onChangeColumns?: (columnIndex: number, width: number, columns: AXFDGColumn<T>[]) => void;
  onChangeData?: (index: number, columnIndex: number, item: T, column: AXFDGColumn<T>) => void;
  onLoadMore?: (params: { scrollLeft: number; scrollTop: number }) => void;

  rowKey?: React.Key | React.Key[];
  selectedRowKey?: React.Key | React.Key[];
  editable?: boolean;
}

function Table<T>(props: Props<T>) {
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
  const columns = useAppStore(s => s.columns);
  const data = useAppStore(s => s.data);
  const setScroll = useAppStore(s => s.setScroll);
  const trHeight = itemHeight + itemPadding * 2 + 1;
  const paddingTop = Math.floor(scrollTop / trHeight) * trHeight;
  const frozenColumnsWidth = useAppStore(s => s.frozenColumnsWidth);
  const rowChecked = useAppStore(s => s.rowChecked);
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
  const setCheckedIndexesMap = useAppStore(s => s.setCheckedIndexesMap);
  const setSortParams = useAppStore(s => s.setSortParams);
  const setFrozenColumnsWidth = useAppStore(s => s.setFrozenColumnsWidth);
  const setPage = useAppStore(s => s.setPage);
  const setData = useAppStore(s => s.setData);
  const setColumns = useAppStore(s => s.setColumns);
  const setColumnsGroup = useAppStore(s => s.setColumnsGroup);
  const setRowKey = useAppStore(s => s.setRowKey);
  const setFocusedRowKey = useAppStore(s => s.setSelectedRowKey);

  const setEditable = useAppStore(s => s.setEditable);

  const setOnClick = useAppStore(s => s.setOnClick);
  const setOnChangeColumns = useAppStore(s => s.setOnChangeColumns);
  const setOnChangeData = useAppStore(s => s.setOnChangeData);
  const setOnLoadMore = useAppStore(s => s.setOnLoadMore);

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
      const propsHeight = Math.max(props.height, 100);
      setHeight(propsHeight);
      const contentBodyHeight = propsHeight - headerHeight - (page ? footerHeight : 0) - containerBorderWidth * 2;
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
    if (props.width !== undefined) {
      setWidth(Math.max(props.width, 100));
    }
  }, [setWidth, props.width]);
  React.useEffect(() => {
    if (props.loading !== undefined) setLoading(props.loading);
  }, [setLoading, props.loading]);
  React.useEffect(() => {
    if (props.spinning !== undefined) setSpinning(props.spinning);
  }, [setSpinning, props.spinning]);
  React.useEffect(() => {
    if (props.headerHeight !== undefined) setHeaderHeight(Math.max(props.headerHeight, 22));
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
    if (props.frozenColumnIndex !== undefined) {
      const frozenColumnsWidth = getFrozenColumnsWidth({
        rowChecked,
        itemHeight,
        frozenColumnIndex: props.frozenColumnIndex,
        columns,
      });
      setFrozenColumnsWidth(frozenColumnsWidth);
      setFrozenColumnIndex(props.frozenColumnIndex);
    }
  }, [setFrozenColumnIndex, props.frozenColumnIndex, rowChecked, itemHeight, columns, setFrozenColumnsWidth]);
  React.useEffect(() => {
    if (props.checkedIndexesMap !== undefined) setCheckedIndexesMap(props.checkedIndexesMap);
  }, [setCheckedIndexesMap, props.checkedIndexesMap]);
  React.useEffect(() => {
    if (props.sortParams !== undefined) setSortParams(props.sortParams);
  }, [setSortParams, props.sortParams]);
  React.useEffect(() => {
    if (props.page !== undefined) setPage({ ...props.page });
  }, [
    setPage,
    props.page,
    props.page?.currentPage,
    props.page?.loading,
    props.page?.pageSize,
    props.page?.totalPages,
    props.page?.totalElements,
    props.page?.onChange,
    props.page?.displayPaginationLength,
  ]);
  React.useEffect(() => {
    if (props.data !== undefined) setData(props.data);
  }, [setData, props.data]);
  React.useEffect(() => {
    if (props.columns !== undefined) setColumns(props.columns);
  }, [setColumns, props.columns]);
  React.useEffect(() => {
    if (props.columnsGroup !== undefined) setColumnsGroup(props.columnsGroup);
  }, [setColumnsGroup, props.columnsGroup]);

  React.useEffect(() => {
    if (props.rowKey !== undefined) setRowKey(props.rowKey);
  }, [setRowKey, props.rowKey]);
  React.useEffect(() => {
    if (props.selectedRowKey !== undefined) setFocusedRowKey(props.selectedRowKey);
  }, [setFocusedRowKey, props.selectedRowKey]);
  React.useEffect(() => {
    if (props.editable !== undefined) setEditable(props.editable);
  }, [setEditable, props.editable]);

  React.useEffect(() => {
    setOnClick(props.onClick);
  }, [setOnClick, props.onClick]);
  React.useEffect(() => {
    setOnChangeColumns(props.onChangeColumns);
  }, [setOnChangeColumns, props.onChangeColumns]);
  React.useEffect(() => {
    setOnChangeData(props.onChangeData);
  }, [setOnChangeData, props.onChangeData]);
  React.useEffect(() => {
    setOnLoadMore(props.onLoadMore);
  }, [setOnLoadMore, props.onLoadMore]);

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
      role={'axframe-datagrid'}
      style={{ width, height, borderWidth: `${containerBorderWidth}px` }}
      className={className}
    >
      <HeaderContainer style={{ height: headerHeight }} role={'rfdg-header-container'}>
        {frozenColumnsWidth > 0 && (
          <FrozenHeader
            style={{
              width: frozenColumnsWidth,
            }}
            role={'rfdg-frozen-header'}
          >
            <TableHeadFrozen container={containerRef} />
          </FrozenHeader>
        )}
        <Header style={{ marginLeft: -scrollLeft, paddingLeft: frozenColumnsWidth }} role={'rfdg-header'}>
          <TableHead container={containerRef} />
        </Header>
      </HeaderContainer>

      <BodyContainer style={{ height: contentBodyHeight }} isLast={!page}>
        {frozenColumnsWidth > 0 && (
          <FrozenScrollContent
            ref={frozenScrollContainerRef}
            style={{
              width: frozenColumnsWidth,
            }}
            role={'rfdg-frozen-scroll-container'}
          >
            <TableBodyFrozen
              style={{
                marginTop: -scrollTop % trHeight,
              }}
            />
          </FrozenScrollContent>
        )}
        <ScrollContainer ref={scrollContainerRef} role={'rfdg-scroll-container'}>
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
        <FooterContainer style={{ height: footerHeight }} role={'rfdg-footer-container'}>
          <TableFooter />
        </FooterContainer>
      )}
      <Loading active={!!loading} />
    </Container>
  );
}

const Container = styled.div`
  border-color: var(--axfdg-border-color-base);
  border-style: solid;
  border-radius: var(--axfdg-border-radius);
  box-sizing: border-box;
  position: relative;
`;

const HeaderContainer = styled.div`
  background: var(--axfdg-header-bg);
  position: relative;
  min-width: 100%;
  overflow: hidden;
  border-top-left-radius: var(--axfdg-border-radius);
  border-top-right-radius: var(--axfdg-border-radius);
`;

const Header = styled.div`
  z-index: 1;
`;

const FrozenHeader = styled.div`
  position: absolute;
  background-color: var(--axfdg-header-bg);
  border-right: 1px solid var(--axfdg-border-color-base);
  box-shadow: 0 0 2px var(--axfdg-border-color-base);
  z-index: 3;
`;

const BodyContainer = styled.div<{ isLast: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
  background-color: var(--axfdg-scroll-track-bg);
  overflow: hidden;

  ${({ isLast }) => {
    if (isLast) {
      return css`
        border-bottom-left-radius: var(--axfdg-border-radius);
        border-bottom-right-radius: var(--axfdg-border-radius);
      `;
    }
  }}
`;

const ScrollContainer = styled.div`
  position: relative;
  overflow: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: var(--axfdg-scroll-size);
    height: var(--axfdg-scroll-size);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--axfdg-scroll-thumb-bg);
    border-radius: var(--axfdg-scroll-thumb-radius);
    border: 2px solid var(--axfdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--axfdg-scroll-thumb-hover-bg);
    border: 1px solid var(--axfdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-track {
    background-color: var(--axfdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-track:vertical {
    background-color: var(--axfdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-track:horizontal {
    background-color: var(--axfdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-corner {
    //background-color: var(--axfdg-scroll-track-corner-bg);
  }
`;

const ScrollContent = styled.div`
  position: absolute;
  min-width: 100%;
  z-index: 1;
`;

const FrozenScrollContent = styled.div`
  flex: none;
  border-right: 1px solid var(--axfdg-border-color-base);
  box-shadow: 0 0 2px var(--axfdg-border-color-base);
  z-index: 2;
  overflow: hidden;
  position: relative;
`;

const FooterContainer = styled.div`
  position: relative;
  min-width: 100%;
  overflow: hidden;
  background: var(--axfdg-footer-bg);
  border-top: 1px solid var(--axfdg-border-color-base);

  border-bottom-left-radius: var(--axfdg-border-radius);
  border-bottom-right-radius: var(--axfdg-border-radius);
`;

export default Table;
