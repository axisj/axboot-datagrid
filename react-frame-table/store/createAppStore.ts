import createContext from 'zustand/context';
import { RFTableColumnGroup, RFTableProps } from '../types';
import { StoreApi } from 'zustand';

export interface AppModel<T = Record<string, any>> extends RFTableProps<T> {
  headerHeight: number;
  columnsGroup: RFTableColumnGroup[];
  containerBorderWidth: number;
  contentBodyHeight: number;
  displayItemCount: number;
  trHeight: number;
  checkboxHeight: number;
  scrollTop: number;
  scrollLeft: number;
}

export interface AppActions {
  setScrollTop: (scrollTop: number) => void;
  setScrollLeft: (scrollTop: number) => void;
}

export interface AppStore<T = Record<string, any>> extends AppModel<T>, AppActions {}

const { Provider: AppStoreProvider, useStore: useAppStore } = createContext<StoreApi<AppStore<any>>>();
export { AppStoreProvider, useAppStore };

export type ZustandSetter<T> = (partial: Partial<T>, replace?: boolean | undefined) => void;
export type ZustandGetter<T> = () => T;
export type StoreActions = <T>(set: ZustandSetter<AppModel<T>>, get: ZustandGetter<AppModel<T>>) => AppActions;

export const getAppStoreActions: StoreActions = (set, get) => ({
  setScrollTop: scrollTop => set({ scrollTop }),
  setScrollLeft: scrollLeft => set({ scrollLeft }),
});
