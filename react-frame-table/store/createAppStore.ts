import createContext from 'zustand/context';
import { AppStore } from '../types';
import { StoreApi } from 'zustand';

const {
  Provider: AppStoreProvider,
  useStore: useAppStore,
  useStoreApi: useAppStoreApi,
} = createContext<StoreApi<AppStore<any>>>();
export { AppStoreProvider, useAppStore, useAppStoreApi };
