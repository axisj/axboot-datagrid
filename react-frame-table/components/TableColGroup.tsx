import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';

function TableColGroup() {
  const itemHeight = useAppStore(s => s.itemHeight);
  const itemPadding = useAppStore(s => s.itemPadding);
  const trHeight = itemHeight + itemPadding * 2;
  const columns = useAppStore(s => s.columns);
  const hasRowSelection = useAppStore(s => !!s.rowSelection);

  return (
    <colgroup>
      {hasRowSelection && <col width={trHeight} />}
      {columns.map((column, index) => (
        <col key={index} width={column.width} />
      ))}
      <col />
    </colgroup>
  );
}

export default TableColGroup;
