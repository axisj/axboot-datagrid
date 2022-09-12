import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';

function TableColGroup() {
  const trHeight = useAppStore(s => s.trHeight);
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
