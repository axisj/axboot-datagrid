import createContext from 'zustand/context';
import { AppActions, AppModel, SelectedAll } from '../types';
import { StoreApi } from 'zustand';
import { getFrozenColumnsWidth } from '../utils';

export interface AppStore<T = Record<string, any>> extends AppModel<T>, AppActions {}

const { Provider: AppStoreProvider, useStore: useAppStore } = createContext<StoreApi<AppStore<any>>>();
export { AppStoreProvider, useAppStore };

export type ZustandSetter<T> = (partial: Partial<T>, replace?: boolean | undefined) => void;
export type ZustandGetter<T> = () => T;
export type StoreActions = <T>(set: ZustandSetter<AppModel<T>>, get: ZustandGetter<AppModel<T>>) => AppActions;

export const getAppStoreActions: StoreActions = (set, get) => ({
  setScrollTop: scrollTop => set({ scrollTop }),
  setScrollLeft: scrollLeft => set({ scrollLeft }),
  setScroll: (scrollTop, scrollLeft) => set({ scrollTop, scrollLeft }),
  setData: data => set({ data }),
  setSelectedIds: keys => {
    const selectedIdsMap = get().selectedIdsMap;
    selectedIdsMap.clear();
    keys.forEach(key => selectedIdsMap.set(key, true));

    const selectedAll: SelectedAll =
      selectedIdsMap.size > 0 && selectedIdsMap.size !== get().data.length
        ? 'indeterminate'
        : selectedIdsMap.size !== 0;

    set({ selectedIdsMap: new Map([...selectedIdsMap]), selectedAll });
    get().rowSelection?.onChange([...get().selectedIdsMap.keys()].sort(), selectedAll);
  },
  setSelectedAll: selectedAll => {
    const selectedIdsMap: Map<number, any> =
      selectedAll === true ? new Map(get().data.map((v, i) => [i, true])) : new Map();
    set({ selectedIdsMap, selectedAll });

    get().rowSelection?.onChange([...selectedIdsMap.keys()], selectedAll);
  },
  setColumnWidth: (columnIndex, width) => {
    const columns = get().columns;
    if (width !== undefined) {
      if (columns[columnIndex]) {
        columns[columnIndex].width = width;

        const frozenColumnsWidth = getFrozenColumnsWidth({
          rowSelection: get().rowSelection,
          itemHeight: get().itemHeight,
          itemPadding: get().itemPadding,
          frozenColumnIndex: get().frozenColumnIndex,
          columns,
        });

        set({ columns: [...columns], frozenColumnsWidth });
      }
    } else {
      get().onChangeColumns?.(columnIndex, columns[columnIndex].width, columns);
    }
  },
});
