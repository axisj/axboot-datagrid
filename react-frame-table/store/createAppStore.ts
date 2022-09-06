import create, {StoreApi} from 'zustand';
import createContext from 'zustand/context';

export interface AppModel {
  bears: number;
}

export interface AppActions {
  increasePopulation: () => void;
  removeAllBears: () => void;
}

export interface AppStore extends AppModel, AppActions {
}

export const createAppStore = () =>
  create<AppStore>(set => ({
    bears: 0,
    increasePopulation: () => set(state => ({bears: state.bears + 1})),
    removeAllBears: () => set({bears: 0}),
  }));

const {Provider, useStore} = createContext<StoreApi<AppStore>>();
export {Provider, useStore};
