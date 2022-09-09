import { State, StoreApi } from 'zustand';
import createContext from 'zustand/context';
import { RFTableColumnGroup, RFTableDataItem, RFTableProps } from '../types';

export interface AppModel extends RFTableProps {
  headerHeight: number;
  columnsGroup: RFTableColumnGroup[];
  containerBorderWidth: number;
  contentBodyHeight: number;
  displayItemCount: number;
  trHeight: number;
  scrollTop: number;
  scrollLeft: number;
}

export interface AppActions {
  setScrollTop: (scrollTop: number) => void;
  setScrollLeft: (scrollTop: number) => void;
}

export interface AppStore extends AppModel, AppActions {}

const { Provider: AppStoreProvider, useStore: useAppStore } = createContext<StoreApi<AppStore>>();
export { AppStoreProvider, useAppStore };

export type ZustandSetter<T> = (partial: Partial<T>, replace?: boolean | undefined) => void;
export type ZustandGetter<T> = () => T;
export type StoreActions = (set: ZustandSetter<AppModel>, get: ZustandGetter<AppModel>) => AppActions;

export const getAppStoreActions: StoreActions = (set, get) => ({
  setScrollTop: scrollTop => set({ scrollTop }),
  setScrollLeft: scrollLeft => set({ scrollLeft }),
});
