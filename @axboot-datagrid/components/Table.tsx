import { css } from '@emotion/react';
import styled from '@emotion/styled';
import * as React from 'react';
import { Key, useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import {
  AppModelColumn,
  AXDGColumnGroup,
  AXDGDataItem,
  AXDGPage,
  AXDGProps,
  AXDGRowChecked,
  AXDGSortInfo,
  AXDGSortParam,
} from '../types';
import { getFrozenColumnsWidth } from '../utils';
import Loading from './Loading';
import TableBody from './TableBody';
import TableBodyFrozen from './TableBodyFrozen';
import TableFooter from './TableFooter';
import TableHead from './TableHead';
import TableHeadFrozen from './TableHeadFrozen';
import { TableSummary } from './TableSummary';
import { TableSummaryFrozen } from './TableSummaryFronzen';

interface Props<T> {
  width?: number;
  height?: number;
  headerHeight?: number;
  footerHeight?: number;
  summaryHeight?: number;
  itemHeight?: number;
  itemPadding?: number;
  frozenColumnIndex?: number;

  columns: AppModelColumn<T>[];
  columnsGroup: AXDGColumnGroup[];
  onChangeColumns?: AXDGProps<T>['onChangeColumns'];
  data?: AXDGDataItem<T>[];
  onChangeData?: AXDGProps<T>['onChangeData'];

  page?: AXDGPage;
  onLoadMore?: AXDGProps<T>['onLoadMore'];

  loading?: boolean;
  spinning?: boolean;
  scrollTop?: number;
  scrollLeft?: number;

  rowChecked?: AXDGRowChecked;
  checkedIndexesMap: Map<number, any>;
  sort?: AXDGSortInfo;
  sortParams?: Record<string, AXDGSortParam>;
  onClick?: AXDGProps<T>['onClick'];

  msg?: AXDGProps<T>['msg'];

  rowKey?: Key | Key[];
  selectedRowKey?: Key | Key[];
  editable?: boolean;
  editTrigger: AXDGProps<T>['editTrigger'];
  showLineNumber?: boolean;

  getRowClassName?: AXDGProps<T>['getRowClassName'];
  cellMergeOptions?: AXDGProps<T>['cellMergeOptions'];
  variant?: AXDGProps<T>['variant'];
  summary?: AXDGProps<T>['summary'];
  columnSortable?: AXDGProps<T>['columnSortable'];
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
  const summaryHeight = useAppStore(s => s.summaryHeight);
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
  const showLineNumber = useAppStore(s => s.showLineNumber);
  const summary = useAppStore(s => s.summary);

  const setHeight = useAppStore(s => s.setHeight);
  const setContentBodyHeight = useAppStore(s => s.setContentBodyHeight);
  const setDisplayItemCount = useAppStore(s => s.setDisplayItemCount);
  const setWidth = useAppStore(s => s.setWidth);
  const setLoading = useAppStore(s => s.setLoading);
  const setSpinning = useAppStore(s => s.setSpinning);

  const setHeaderHeight = useAppStore(s => s.setHeaderHeight);
  const setFooterHeight = useAppStore(s => s.setFooterHeight);
  const setSummaryHeight = useAppStore(s => s.setSummaryHeight);
  const setItemHeight = useAppStore(s => s.setItemHeight);
  const setItemPadding = useAppStore(s => s.setItemPadding);
  const setFrozenColumnIndex = useAppStore(s => s.setFrozenColumnIndex);
  const setRowChecked = useAppStore(s => s.setRowChecked);
  const setCheckedIndexesMap = useAppStore(s => s.setCheckedIndexesMap);
  const setSort = useAppStore(s => s.setSort);
  const setSortParams = useAppStore(s => s.setSortParams);
  const setFrozenColumnsWidth = useAppStore(s => s.setFrozenColumnsWidth);
  const setPage = useAppStore(s => s.setPage);
  const setData = useAppStore(s => s.setData);
  const setColumns = useAppStore(s => s.setColumns);
  const setColumnsGroup = useAppStore(s => s.setColumnsGroup);
  const setRowKey = useAppStore(s => s.setRowKey);
  const setFocusedRowKey = useAppStore(s => s.setSelectedRowKey);
  const setDisplayPaginationLength = useAppStore(s => s.setDisplayPaginationLength);

  const setEditable = useAppStore(s => s.setEditable);
  const setEditTrigger = useAppStore(s => s.setEditTrigger);

  const setOnClick = useAppStore(s => s.setOnClick);
  const setOnChangeColumns = useAppStore(s => s.setOnChangeColumns);
  const setOnChangeData = useAppStore(s => s.setOnChangeData);
  const setOnLoadMore = useAppStore(s => s.setOnLoadMore);
  const setShowLineNumber = useAppStore(s => s.setShowLineNumber);
  const setMsg = useAppStore(s => s.setMsg);
  const setRowClassName = useAppStore(s => s.setRowClassName);
  const setCellMergeOptions = useAppStore(s => s.setCellMergeOptions);
  const setVariant = useAppStore(s => s.setVariant);
  const setSummary = useAppStore(s => s.setSummary);
  const setColumnSortable = useAppStore(s => s.setColumnSortable);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const frozenScrollContainerRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollLeft } = scrollContainerRef.current;

      if (containerRef.current) {
        const contHeader = containerRef.current.querySelector('[role="rfdg-header"]') as any;
        if (contHeader && contHeader['style']) {
          contHeader['style'].marginLeft = `${-scrollLeft}px`;
        }
      }

      setScroll(scrollTop, scrollLeft);
    }
  }, [setScroll]);

  const onWheel: (this: HTMLDivElement, ev: HTMLElementEventMap['wheel']) => any = useCallback(evt => {
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
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollLeft + delta.x;
    }
  }, []);

  useEffect(() => {
    if (props.height !== undefined) {
      const propsHeight = Math.max(props.height, 100);
      setHeight(propsHeight);
      const contentBodyHeight =
        propsHeight -
        headerHeight -
        (page ? footerHeight : 0) -
        (summary ? summaryHeight : 0) -
        containerBorderWidth * 2;
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
    summary,
    summaryHeight,
  ]);

  useEffect(() => {
    if (props.width !== undefined) {
      setWidth(Math.max(props.width, 100));
    }
  }, [setWidth, props.width]);
  useEffect(() => {
    if (props.loading !== undefined) setLoading(props.loading);
  }, [setLoading, props.loading]);
  useEffect(() => {
    if (props.spinning !== undefined) setSpinning(props.spinning);
  }, [setSpinning, props.spinning]);
  useEffect(() => {
    if (props.headerHeight !== undefined) setHeaderHeight(Math.max(props.headerHeight, 22));
  }, [setHeaderHeight, props.headerHeight]);
  useEffect(() => {
    if (props.footerHeight !== undefined) setFooterHeight(props.footerHeight);
  }, [setFooterHeight, props.footerHeight]);
  useEffect(() => {
    if (props.summaryHeight !== undefined) setSummaryHeight(props.summaryHeight);
  }, [setSummaryHeight, props.summaryHeight]);
  useEffect(() => {
    if (props.itemHeight !== undefined) setItemHeight(props.itemHeight);
  }, [setItemHeight, props.itemHeight]);
  useEffect(() => {
    if (props.itemPadding !== undefined) setItemPadding(props.itemPadding);
  }, [setItemPadding, props.itemPadding]);
  useEffect(() => {
    const frozenColumnsWidth = getFrozenColumnsWidth({
      showLineNumber,
      rowChecked,
      itemHeight,
      frozenColumnIndex: props.frozenColumnIndex ?? 0,
      columns,
      dataLength: data.length,
    });
    setFrozenColumnsWidth(frozenColumnsWidth);
    setFrozenColumnIndex(props.frozenColumnIndex ?? 0);
  }, [
    setFrozenColumnIndex,
    props.frozenColumnIndex,
    showLineNumber,
    rowChecked,
    itemHeight,
    columns,
    setFrozenColumnsWidth,
    data.length,
  ]);
  useEffect(() => {
    if (props.checkedIndexesMap !== undefined) setCheckedIndexesMap(props.checkedIndexesMap);
  }, [setCheckedIndexesMap, props.checkedIndexesMap]);
  useEffect(() => {
    setRowChecked(props.rowChecked);
  }, [setRowChecked, props.rowChecked]);
  useEffect(() => {
    setSort(props.sort);
  }, [setSort, props.sort]);
  useEffect(() => {
    setSortParams(props.sortParams);
  }, [setSortParams, props.sortParams]);
  useEffect(() => {
    if (props.page !== undefined) {
      setPage({ ...props.page });
      setDisplayPaginationLength(props.page?.displayPaginationLength ?? 5);
    }
  }, [
    setPage,
    setDisplayPaginationLength,
    props.page,
    props.page?.currentPage,
    props.page?.loading,
    props.page?.pageSize,
    props.page?.totalPages,
    props.page?.totalElements,
    props.page?.onChange,
    props.page?.displayPaginationLength,
  ]);
  useEffect(() => {
    if (props.data !== undefined) setData(props.data);
  }, [setData, props.data]);
  useEffect(() => {
    if (props.columns !== undefined) {
      setColumns(props.columns);
    }
  }, [setColumns, props.columns]);
  useEffect(() => {
    if (props.columnsGroup !== undefined) setColumnsGroup(props.columnsGroup);
  }, [setColumnsGroup, props.columnsGroup]);
  useEffect(() => {
    if (props.rowKey !== undefined) setRowKey(props.rowKey);
  }, [setRowKey, props.rowKey]);
  useEffect(() => {
    if (props.selectedRowKey !== undefined) setFocusedRowKey(props.selectedRowKey);
  }, [setFocusedRowKey, props.selectedRowKey]);
  useEffect(() => {
    if (props.editable !== undefined) setEditable(props.editable);
  }, [setEditable, props.editable]);
  useEffect(() => {
    if (props.editTrigger !== undefined) setEditTrigger(props.editTrigger);
  }, [setEditTrigger, props.editTrigger]);

  useEffect(() => {
    setOnClick(props.onClick);
  }, [setOnClick, props.onClick]);
  useEffect(() => {
    setOnChangeColumns(props.onChangeColumns);
  }, [setOnChangeColumns, props.onChangeColumns]);
  useEffect(() => {
    setOnChangeData(props.onChangeData);
  }, [setOnChangeData, props.onChangeData]);
  useEffect(() => {
    setOnLoadMore(props.onLoadMore);
  }, [setOnLoadMore, props.onLoadMore]);
  useEffect(() => {
    setShowLineNumber(props.showLineNumber);
  }, [setShowLineNumber, props.showLineNumber]);
  useEffect(() => {
    setMsg(props.msg);
  }, [setMsg, props.msg]);
  useEffect(() => {
    setRowClassName(props.getRowClassName);
  }, [setRowClassName, props.getRowClassName]);
  useEffect(() => {
    setCellMergeOptions(props.cellMergeOptions);
  }, [setCellMergeOptions, props.cellMergeOptions]);
  useEffect(() => {
    setVariant(props.variant);
  }, [setVariant, props.variant]);
  useEffect(() => {
    setSummary(props.summary);
  }, [setSummary, props.summary]);
  useEffect(() => {
    setColumnSortable(props.columnSortable);
  }, [setColumnSortable, props.columnSortable]);

  //setInitialized
  useEffect(() => {
    setInitialized(true);

    const scrollContainerRefCurrent = scrollContainerRef?.current;
    const frozenScrollContainerRefCurrent = frozenScrollContainerRef?.current;
    if (scrollContainerRefCurrent) {
      scrollContainerRefCurrent.removeEventListener('scroll', onScroll);
      scrollContainerRefCurrent.addEventListener('scroll', onScroll, { passive: true, capture: true });
      scrollContainerRefCurrent.scrollLeft = props.scrollLeft ?? scrollLeft;
      scrollContainerRefCurrent.scrollTop = props.scrollTop ?? scrollTop;
      scrollContainerRefCurrent.removeEventListener('wheel', onWheel);
      scrollContainerRefCurrent.addEventListener('wheel', onWheel, { passive: false, capture: true });
    }

    if (frozenScrollContainerRefCurrent) {
      frozenScrollContainerRefCurrent.removeEventListener('wheel', onWheel);
      frozenScrollContainerRefCurrent.addEventListener('wheel', onWheel, { passive: false, capture: true });
    }

    return () => {
      scrollContainerRefCurrent?.removeEventListener('scroll', onScroll);
      scrollContainerRefCurrent?.removeEventListener('wheel', onWheel);
      frozenScrollContainerRefCurrent?.removeEventListener('wheel', onWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.scrollTop, props.scrollLeft, scrollContainerRef?.current, frozenScrollContainerRef?.current]);

  return (
    <Container
      ref={containerRef}
      role={'ax-datagrid'}
      style={{ width, height, borderWidth: `${containerBorderWidth}px` }}
      className={className}
    >
      <HeaderContainer style={{ height: headerHeight }} role={'rfdg-header-container'}>
        {(frozenColumnsWidth ?? 0) > 0 && (
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

      {summary && summary.position === 'top' && (
        <SummaryContainer position={'top'} style={{ height: summaryHeight }} role={'rfdg-summary-container'}>
          {(frozenColumnsWidth ?? 0) > 0 && (
            <FrozenSummary
              style={{
                width: frozenColumnsWidth,
              }}
              role={'rfdg-frozen-summary'}
            >
              <TableSummaryFrozen container={containerRef} />
            </FrozenSummary>
          )}
          <Summary style={{ marginLeft: -scrollLeft, paddingLeft: frozenColumnsWidth }} role={'rfdg-summary'}>
            <TableSummary container={containerRef} />
          </Summary>
        </SummaryContainer>
      )}

      <BodyContainer style={{ height: contentBodyHeight }} isLast={!page}>
        {(frozenColumnsWidth ?? 0) > 0 && (
          <FrozenScrollContent
            ref={frozenScrollContainerRef}
            style={{
              width: frozenColumnsWidth,
            }}
            role={'rfdg-frozen-scroll-container'}
          >
            <TableBodyFrozen
              scrollContainerRef={scrollContainerRef}
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
            <TableBody scrollContainerRef={scrollContainerRef} />
          </ScrollContent>
        </ScrollContainer>

        <Loading active={!!spinning} size={'small'} />
      </BodyContainer>

      {summary && summary.position === 'bottom' && (
        <SummaryContainer position={'bottom'} style={{ height: summaryHeight }} role={'rfdg-summary-container'}>
          {(frozenColumnsWidth ?? 0) > 0 && (
            <FrozenSummary
              style={{
                width: frozenColumnsWidth,
              }}
              role={'rfdg-frozen-summary'}
            >
              <TableSummaryFrozen container={containerRef} />
            </FrozenSummary>
          )}
          <Summary style={{ marginLeft: -scrollLeft, paddingLeft: frozenColumnsWidth }} role={'rfdg-summary'}>
            <TableSummary container={containerRef} />
          </Summary>
        </SummaryContainer>
      )}

      {page && (
        <FooterContainer style={{ height: footerHeight }} role={'rfdg-footer-container'}>
          <TableFooter />
        </FooterContainer>
      )}
      <Loading active={loading} />
    </Container>
  );
}

const Container = styled.div`
  border-color: var(--axdg-border-color-base);
  border-style: solid;
  border-radius: var(--axdg-border-radius);
  box-sizing: border-box;
  position: relative;
`;

const HeaderContainer = styled.div`
  background: var(--axdg-header-bg);
  position: relative;
  min-width: 100%;
  overflow: hidden;
  border-top-left-radius: var(--axdg-border-radius);
  border-top-right-radius: var(--axdg-border-radius);
  box-sizing: border-box;
`;

const Header = styled.div`
  z-index: 1;
`;

const FrozenHeader = styled.div`
  position: absolute;
  background-color: var(--axdg-header-bg);
  border-right: 1px solid var(--axdg-border-color-base);
  box-shadow: 0 0 2px var(--axdg-border-color-base);
  z-index: 3;
  box-sizing: border-box;
`;

const BodyContainer = styled.div<{ isLast: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
  background-color: var(--axdg-scroll-track-bg);
  overflow: hidden;
  box-sizing: border-box;

  ${({ isLast }) => {
    if (isLast) {
      return css`
        border-bottom-left-radius: var(--axdg-border-radius);
        border-bottom-right-radius: var(--axdg-border-radius);
      `;
    }
  }}
`;

const ScrollContainer = styled.div`
  position: relative;
  overflow: auto;
  flex: 1;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: var(--axdg-scroll-size);
    height: var(--axdg-scroll-size);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--axdg-scroll-thumb-bg);
    border-radius: var(--axdg-scroll-thumb-radius);
    border: 2px solid var(--axdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--axdg-scroll-thumb-hover-bg);
    border: 1px solid var(--axdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-track {
    background-color: var(--axdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-track:vertical {
    background-color: var(--axdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-track:horizontal {
    background-color: var(--axdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-corner {
    //background-color: var(--axdg-scroll-track-corner-bg);
  }
`;

const ScrollContent = styled.div`
  position: absolute;
  min-width: 100%;
  z-index: 1;
  box-sizing: border-box;
`;

const FrozenScrollContent = styled.div`
  flex: none;
  border-right: 1px solid var(--axdg-border-color-base);
  box-shadow: 0 0 2px var(--axdg-border-color-base);
  z-index: 2;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
`;

const FooterContainer = styled.div`
  position: relative;
  min-width: 100%;
  overflow: hidden;
  background: var(--axdg-footer-bg);
  border-top: 1px solid var(--axdg-border-color-base);

  border-bottom-left-radius: var(--axdg-border-radius);
  border-bottom-right-radius: var(--axdg-border-radius);
  box-sizing: border-box;
`;

const SummaryContainer = styled.div<{ position: string }>`
  background: var(--axdg-summary-bg);
  position: relative;
  min-width: 100%;
  overflow: hidden;
  box-sizing: border-box;

  ${({ position }) => {
    if (position === 'top') {
      return css`
        border-bottom: 1px solid var(--axdg-border-color-base);
      `;
    } else {
      return css`
        border-top: 1px solid var(--axdg-border-color-base);
      `;
    }
  }}

  &:last-child {
    border-bottom-left-radius: var(--axdg-border-radius);
    border-bottom-right-radius: var(--axdg-border-radius);
  }
`;

const Summary = styled.div`
  z-index: 1;
  box-sizing: border-box;
`;
const FrozenSummary = styled.div`
  position: absolute;
  background: var(--axdg-summary-bg);
  border-right: 1px solid var(--axdg-border-color-base);
  box-shadow: 0 0 2px var(--axdg-border-color-base);
  z-index: 3;
  box-sizing: border-box;
`;

export default Table;
