import * as React from 'react';
import {createAppStore, Provider} from './store';
import Table from "./components/Table";

interface Props {
}

export function RFTable(props: Props) {
  return (
    <Provider createStore={createAppStore}>
      <Table/>
    </Provider>
  );
}
