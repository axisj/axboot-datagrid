import styled from '@emotion/styled';
import { useMemo } from 'react';
import * as React from 'react';
import { useAppStore } from '../store';
import { AXDGProps } from '../types';
import TableColGroup from './TableColGroup';

interface Props {
  container: React.RefObject<HTMLDivElement>;
}

export function TableSummary<T>({ container }: Props) {
  const summaryHeight = useAppStore(s => s.summaryHeight);
  const summary = useAppStore(s => s.summary);
  const columns = useAppStore(s => s.columns);
  const columnsGroup = useAppStore(s => s.columnsGroup);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const variant = useAppStore(s => s.variant);
  const data = useAppStore(s => s.data);

  const summaryColumns = useMemo(() => {
    return columns.slice(frozenColumnIndex).map((column, index) => {
      const ci = frozenColumnIndex + index;
      return {
        column,
        columnIndex: ci,
        summaryColumn: summary?.columns?.find(sc => sc.columnIndex === ci),
      };
    });
  }, [columns, frozenColumnIndex, summary]);

  return (
    <SummaryTable variant={variant} summaryHeight={summaryHeight}>
      <TableColGroup />
      <tbody role={'rfdg-summary'}>
        <tr>
          {summaryColumns.map(({ column, summaryColumn, columnIndex }, index) => {
            if (!summaryColumn) return <td key={index}></td>;
            return (
              <td key={index} colSpan={summaryColumn.colSpan ?? 1}>
                {summaryColumn.itemRender?.({
                  column,
                  columnIndex,
                  data,
                })}
              </td>
            );
          })}
        </tr>
      </tbody>
    </SummaryTable>
  );
}

export const SummaryTable = styled.table<{ summaryHeight: number; variant: AXDGProps<any>['variant'] }>`
  table-layout: fixed;
  width: 100%;
  border-collapse: unset;
  border-spacing: 0;
  height: ${p => p.summaryHeight}px;
  color: var(--axdg-header-color);
  font-weight: var(--axdg-header-font-weight);

  tbody {
    height: ${p => p.summaryHeight}px;
    overflow: hidden;
  }
`;
