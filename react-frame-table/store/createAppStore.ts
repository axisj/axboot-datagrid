import { StoreApi } from 'zustand';
import createContext from 'zustand/context';
import { RFTableColumnGroup, RFTableProps } from '../types';

export interface AppModel extends RFTableProps {
  headerHeight: number;
  columnsGroup: RFTableColumnGroup[];
  containerBorderWidth: number;
  trHeight: number;
  scrollTop: number;
  scrollLeft: number;
}

export interface AppActions {}

export interface AppStore extends AppModel, AppActions {}

const { Provider: AppStoreProvider, useStore: useAppStore } = createContext<StoreApi<AppStore>>();
export { AppStoreProvider, useAppStore };
