import React from 'react';

type Direction = 'left' | 'center' | 'right';
type Size = 'small' | 'medium' | 'large';

export interface RFTableColumn<T> {
  key: string | string[];
  label: string;
  width?: number;
  align?: Direction;
  itemRender?: (item: T) => React.ReactNode;
}

export interface RFTableColumnGroup {
  label: string;
  colspan: number;
}

export type RFTableDataItem = {
  values: Record<string, any>;
  status?: string;
  parentItemIndex?: number;
};

export interface RFTablePage {
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  totalElements?: number;
  loading?: boolean;
  onChange?: (currentPage: number, pageSize?: number) => void;
}

export interface RFTableRowSelection {
  selectedKeys: string[];
  onChange: (selectedKeys: string[]) => void;
}

export interface RFTableProps<T> {
  width: number;
  height: number;
  headerHeight?: number;
  data: RFTableDataItem[];
  columns: RFTableColumn<T>[];
  columnsGroup?: RFTableColumnGroup[];
  itemHeight?: number;
  itemPadding?: number;

  page?: RFTablePage;
  enableLoadMore?: boolean;
  onLoadMore?: (params: { scrollLeft: number; scrollTop: number }) => void;
  endLoadMoreRender?: () => React.ReactNode;

  className?: string;
  style?: React.CSSProperties;
  loading?: boolean;
  spinning?: boolean;

  scrollTop?: number;
  scrollLeft?: number;

  rowSelection?: RFTableRowSelection;
  msg?: {
    emptyList?: string;
  };
}
