import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';

function TableColGroup() {
  const columns = useAppStore(s => s.columns);

  return (
    <colgroup>
      {columns.map((column, index) => (
        <col key={index} width={column.width} />
      ))}
    </colgroup>
  );
}

export default TableColGroup;
