import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import TableBodyTr from './TableBodyTr';
import TableColGroup from './TableColGroup';

function TableBody() {
  const scrollTop = useAppStore(s => s.scrollTop);
  const trHeight = useAppStore(s => s.trHeight);
  const displayItemCount = useAppStore(s => s.displayItemCount);
  const data = useAppStore(s => s.data);

  const startIdx = Math.floor(scrollTop / trHeight);
  const endNumber = startIdx + displayItemCount > data.length ? data.length : startIdx + displayItemCount;

  return (
    <BodyTable>
      <TableColGroup />
      {Array.from({ length: endNumber - startIdx }, (_, i) => {
        const ri = startIdx + i;
        const item = data[ri];
        if (!item) {
          return null;
        }

        return <TableBodyTr key={ri} />;
      })}
    </BodyTable>
  );
}

const BodyTable = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;

export default TableBody;
