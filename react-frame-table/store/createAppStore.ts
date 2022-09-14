import createContext from 'zustand/context';
import { RFTableColumnGroup, RFTableDataItem, RFTableProps } from '../types';
import { StoreApi } from 'zustand';

type SelectedAll = true | false | 'indeterminate';

export interface AppModel<T = Record<string, any>> extends RFTableProps<T> {
  headerHeight: number;
  columnsGroup: RFTableColumnGroup[];
  containerBorderWidth: number;
  contentBodyHeight: number;
  displayItemCount: number;
  itemHeight: number;
  itemPadding: number;
  scrollTop: number;
  scrollLeft: number;
  selectedKeyMap: Map<string, any>;
  selectedAll: SelectedAll;
}

export interface AppActions {
  setScrollTop: (scrollTop: number) => void;
  setScrollLeft: (scrollTop: number) => void;
  setData: (data: RFTableDataItem[]) => void;
  setSelectedKeys: (keys: string[]) => void;
  setSelectedAll: (selectedAll: SelectedAll) => void;
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
  setData: data => set({ data }),
  setSelectedKeys: keys => {
    const selectedKeyMap = get().selectedKeyMap;
    selectedKeyMap.clear();
    keys.forEach(key => selectedKeyMap.set(key, true));
    set({ selectedKeyMap: new Map([...selectedKeyMap]) });
  },
  setSelectedAll: selectedAll => set({ selectedAll }),
});
