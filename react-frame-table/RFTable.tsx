import * as React from 'react';
import { AppStoreProvider, AppStore } from './store';
import Table from './components/Table';
import { RFTableProps } from './types';
import create from 'zustand';

export function RFTable({
  width,
  height,
  headerHeight = 24,
  data,
  columns,
  columnsGroup = [],
  trHeight = 24,
}: RFTableProps) {
  const containerBorderWidth = 1;
  const contentBodyHeight = height - headerHeight - containerBorderWidth * 2;
  const displayItemCount = Math.ceil(contentBodyHeight / trHeight);

  return (
    <AppStoreProvider
      createStore={() =>
        create<AppStore>(set => ({
          containerBorderWidth: 1,
          width,
          height,
          headerHeight,
          data,
          columns,
          columnsGroup,
          trHeight,
        }))
      }
    >
      <Table />
    </AppStoreProvider>
  );
}
