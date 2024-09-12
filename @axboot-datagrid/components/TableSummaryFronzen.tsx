import styled from '@emotion/styled';
import * as React from 'react';
import { useAppStore } from '../store';
import TableColGroupFrozen from './TableColGroupFrozen';
import { SummaryTable } from './TableSummary';

interface Props {
  container: React.RefObject<HTMLDivElement>;
}

export function TableSummaryFrozen({}: Props) {
  const summaryHeight = useAppStore(s => s.summaryHeight);
  const summary = useAppStore(s => s.summary);
  const columns = useAppStore(s => s.columns);
  const columnsGroup = useAppStore(s => s.columnsGroup);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const variant = useAppStore(s => s.variant);
  const data = useAppStore(s => s.data);

  return (
    <SummaryTable variant={variant} summaryHeight={summaryHeight}>
      <TableColGroupFrozen />
    </SummaryTable>
  );
}
