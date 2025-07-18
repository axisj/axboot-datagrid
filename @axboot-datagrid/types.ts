import React, { ReactNode } from 'react';

export type AlignDirection = 'left' | 'center' | 'right';
export type MoveDirection = 'prev' | 'next' | 'current';

export const DIRC_MAP = {
  next: 1,
  prev: -1,
  current: 0,
};

export interface AXDGItemRenderProps<T> {
  column: AXDGColumn<T>;
  index: number;
  columnIndex: number;
  item: AXDGDataItem<T>;
  values: T;
  value: any;
  editable?: boolean;
  handleSave?: (value: any, columnDirection?: MoveDirection, rowDirection?: MoveDirection) => void;
  handleCancel?: () => void;
  handleMove?: (columnDirection: MoveDirection, rowDirection: MoveDirection) => void;
}

export interface AXDGColumn<T> {
  key: string | string[];
  label: ReactNode;
  width: number;
  align?: AlignDirection;
  headerAlign?: AlignDirection;
  sortDisable?: boolean;
  className?: string;
  getClassName?: (item: AXDGDataItem<T>) => string;
  headerClassName?: string;
  itemRender?: React.FC<AXDGItemRenderProps<T>>;
  editable?: boolean;
}

export interface AXDGColumnGroup {
  label: ReactNode;
  groupStartIndex: number;
  groupEndIndex: number;
  align?: AlignDirection;
  headerAlign?: AlignDirection;
}

export interface AXDGCellMergeColumn {
  wordWrap?: boolean;
  mergeBy: string | string[];
}

export interface AXDGSummaryItemRenderProps<T> {
  column: AXDGColumn<T>;
  columnIndex: number;
  data: AXDGDataItem<T>[];
}

export interface AXDGSummaryColumn<T> {
  columnIndex: number;
  align?: AlignDirection;
  colSpan?: number;
  className?: string;
  getClassName?: (key: string | string[]) => string;
  itemRender?: React.FC<AXDGSummaryItemRenderProps<T>>;
}

export enum AXDGDataItemStatus {
  new,
  edit,
  remove,
}

export type AXDGDataItem<T> = {
  values: T;
  status?: AXDGDataItemStatus;
  checked?: boolean;
  parentItemIndex?: number;
  meta?: Record<string, any>;
};

export interface AXDGPage {
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  totalElements?: number;
  loading?: boolean;
  onChange?: (currentPage: number, pageSize?: number) => void;
  displayPaginationLength?: number;
  statusRender?: () => void;
  paginationRender?: () => void;
}

export interface AXDGRowChecked<T> {
  isRadio?: boolean;
  checkedIndexes?: number[];
  checkedRowKeys?: React.Key[];
  disabled?: (index: number, item: AXDGDataItem<T>) => boolean;
  onChange: (checkedIndexes: number[], checkedRowKeys: React.Key[], checkedAll?: CheckedAll) => void;
}

export interface AXDGSortParam {
  key?: string;
  index?: number;
  orderBy: 'asc' | 'desc';
}

export interface AXDGSortInfo {
  multiSort?: boolean;
  sortParams: AXDGSortParam[];
  onChange: (sortParams: AXDGSortParam[]) => void;
}

export interface AXDGClickParams<T> {
  index: number;
  columnIndex: number;
  item: T;
  column: AXDGColumn<T>;
}

export interface AXDGChangeColumnsInfo<T> {
  width?: number;
  columns: AXDGColumn<T>[];
  columnsGroup?: AXDGColumnGroup[];
}

export interface AXDGReorderInfo<T> {
  enabled?: boolean;
  handleIcon?: React.ReactNode;
  onReorder?: (data: AXDGDataItem<T>[]) => void;
}
export interface AXDGReorderingInfo {
  fromIndex?: number;
  toIndex?: number;
}

type AXDGColumnWithOptionalWidth<T> = Partial<Pick<AXDGColumn<T>, 'width'>> & Omit<AXDGColumn<T>, 'width'>;

export interface AXDGProps<T> {
  width: number;
  height: number;
  headerHeight?: number;
  footerHeight?: number;
  summaryHeight?: number;
  itemHeight?: number;
  itemPadding?: number;
  frozenColumnIndex?: number;

  columns: AXDGColumnWithOptionalWidth<T>[];
  columnsGroup?: AXDGColumnGroup[];
  onChangeColumns?: (columnIndex: number | null, info: AXDGChangeColumnsInfo<T>) => void;
  data?: AXDGDataItem<T>[];
  onChangeData?: (index: number, columnIndex: number | null, item: T, column: AXDGColumn<T> | null) => void;

  page?: AXDGPage;
  enableLoadMore?: boolean;
  onLoadMore?: (params: { scrollLeft: number; scrollTop: number }) => void;
  endLoadMoreRender?: () => React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  loading?: boolean;
  spinning?: boolean;
  scrollTop?: number;
  scrollLeft?: number;

  rowChecked?: AXDGRowChecked<T>;
  sort?: AXDGSortInfo;
  onClick?: (params: AXDGClickParams<T>) => void;

  msg?: {
    emptyList?: string;
  };

  rowKey?: React.Key | React.Key[];
  selectedRowKey?: React.Key | React.Key[];
  editable?: boolean;
  editTrigger?: 'dblclick' | 'click';
  showLineNumber?: boolean;

  getRowClassName?: (ri: number, item: AXDGDataItem<T>) => string | undefined;
  cellMergeOptions?: {
    columnsMap: Record<number, AXDGCellMergeColumn>;
  };
  variant?: 'default' | 'vertical-bordered';
  summary?: {
    columns: AXDGSummaryColumn<T>[];
    position: 'top' | 'bottom';
  };
  columnSortable?: boolean;
  reorder?: AXDGReorderInfo<T>;
  reorderingInfo?: AXDGReorderingInfo;
}

export type CheckedAll = true | false | 'indeterminate';

export interface AppModelColumn<T> extends AXDGColumn<T> {
  left: number;
}

export interface AppModel<T> extends AXDGProps<T> {
  initialized: boolean;
  headerHeight: number;
  footerHeight: number;
  summaryHeight: number;
  itemHeight: number;
  itemPadding: number;
  frozenColumnIndex: number;
  frozenColumnsWidth?: number;
  columns: AppModelColumn<T>[];
  columnsGroup: AXDGColumnGroup[];
  data: AXDGDataItem<T>[];
  columnResizing: boolean;
  containerBorderWidth: number;
  contentBodyHeight: number;
  displayItemCount: number;
  scrollTop: number;
  scrollLeft: number;
  checkedIndexesMap: Map<number, any>;
  checkedAll: CheckedAll;
  sortParams?: Record<string, AXDGSortParam>;
  displayPaginationLength?: number;
  hoverItemIndexes?: number[];
  loading: boolean;
  editItemIndex?: number;
  editItemColIndex?: number;
  editTrigger?: 'dblclick' | 'click';
  reorder?: AXDGReorderInfo<T>;
  reorderingInfo?: AXDGReorderingInfo;
}

export interface AppActions<T> {
  setInitialized: (initialized: boolean) => void;
  setScrollTop: (scrollTop: number) => void;
  setScrollLeft: (scrollLeft: number) => void;
  setScroll: (scrollTop: number, scrollLeft: number) => void;
  setColumns: (columns: AppModelColumn<T>[]) => void;
  setColumnsGroup: (columnsGroup: AXDGColumnGroup[]) => void;
  setData: (data: AXDGDataItem<T>[]) => void;
  setCheckedIndexes: (ids: number[]) => void;
  setCheckedAll: (checkedAll: CheckedAll) => void;
  setColumnWidth: (
    columnIndex: number,
    options?: {
      width?: number;
      updateColumns?: boolean;
    },
  ) => void;
  setColumnResizing: (columnResizing: boolean) => void;
  toggleColumnSort: (columnIndex: number) => void;
  setPage: (page: AXDGPage) => void;
  setHoverItemIndexes: (hoverItemIndexes?: number[]) => void;
  handleClick: (index: number, columnIndex: number) => void;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setContentBodyHeight: (contentBodyHeight: number) => void;
  setDisplayItemCount: (displayItemCount: number) => void;
  setLoading: (loading: boolean) => void;
  setSpinning: (spinning: boolean) => void;
  setHeaderHeight: (headerHeight: number) => void;
  setFooterHeight: (footerHeight: number) => void;
  setSummaryHeight: (summaryHeight: number) => void;
  setItemHeight: (itemHeight: number) => void;
  setItemPadding: (itemPadding: number) => void;
  setFrozenColumnIndex: (frozenColumnIndex: number) => void;
  setCheckedIndexesMap: (checkedIndexesMap: Map<number, any>) => void;

  setRowChecked: (rowChecked?: AXDGRowChecked<T>) => void;
  setSort: (sort?: AXDGSortInfo) => void;
  setSortParams: (sortParams?: Record<string, AXDGSortParam>) => void;
  setFrozenColumnsWidth: (frozenColumnsWidth: number) => void;
  setRowKey: (rowKey: React.Key | React.Key[]) => void;
  setSelectedRowKey: (rowKey: React.Key | React.Key[]) => void;
  setEditable: (editable: boolean) => void;
  setEditItem: (index: number, columnIndex: number) => void;

  setOnClick: (onClick?: AXDGProps<T>['onClick']) => void;
  setOnChangeColumns: (onChangeColumns?: AXDGProps<T>['onChangeColumns']) => void;
  setOnChangeData: (onChangeData?: AXDGProps<T>['onChangeData']) => void;
  setOnLoadMore: (onLoadMore?: AXDGProps<T>['onLoadMore']) => void;
  setShowLineNumber: (showLineNumber?: boolean) => void;
  setMsg: (msg?: AXDGProps<T>['msg']) => void;
  setDisplayPaginationLength: (length: number) => void;

  setRowClassName: (getRowClassName?: AXDGProps<T>['getRowClassName']) => void;
  setEditTrigger: (editTrigger: 'dblclick' | 'click') => void;
  setCellMergeOptions: (cellMergeOptions: AXDGProps<T>['cellMergeOptions']) => void;
  setVariant: (variant: AXDGProps<T>['variant']) => void;
  setSummary: (summary?: AXDGProps<T>['summary']) => void;
  setColumnSortable: (columnSortable?: boolean) => void;
  sortColumn: (trLevel: number, oldColumn: SortedColumn, newColumn: SortedColumn) => void;
  setReorder: (reorder?: AXDGReorderInfo<T>) => void;
  setReorderingInfo: (reorderingInfo?: AXDGReorderingInfo) => void;
}

export interface SortedColumn {
  index: number;
  columnIndex: number;
}

export interface AppStore<T = any> extends AppModel<T>, AppActions<T> {}

export type ZustandSetter<T> = (partial: Partial<T>, replace?: boolean | undefined) => void;
export type ZustandGetter<T> = () => T;
export type StoreActions = <T>(set: ZustandSetter<AppModel<T>>, get: ZustandGetter<AppModel<T>>) => AppActions<T>;
