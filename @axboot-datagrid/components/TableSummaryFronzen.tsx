import styled from '@emotion/styled';
import { useMemo } from 'react';
import * as React from 'react';
import { useAppStore } from '../store';
import TableColGroupFrozen from './TableColGroupFrozen';
import { HeadTd } from './TableHead';
import { SummaryTable } from './TableSummary';

interface Props {
  container: React.RefObject<HTMLDivElement>;
}

export function TableSummaryFrozen({ container }: Props) {
  const summaryHeight = useAppStore(s => s.summaryHeight);
  const summary = useAppStore(s => s.summary);
  const columns = useAppStore(s => s.columns);
  const columnsGroup = useAppStore(s => s.columnsGroup);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const variant = useAppStore(s => s.variant);
  const data = useAppStore(s => s.data);
  const showLineNumber = useAppStore(s => s.showLineNumber);
  const hasRowSelection = useAppStore(s => !!s.rowChecked);

  const summaryColumns = useMemo(() => {
    let ignoreColumnCnt = 0;
    return columns.slice(0, frozenColumnIndex).map((column, index) => {
      const columnIndex = index;
      const summaryColumn = summary?.columns?.find(sc => sc.columnIndex === columnIndex);

      if (summaryColumn && (summaryColumn.colSpan ?? 1) > 1) {
        ignoreColumnCnt = (summaryColumn.colSpan ?? 1) - 1;
      } else {
        if (ignoreColumnCnt > 0) {
          ignoreColumnCnt--;
          return {};
        }
      }

      return {
        column,
        columnIndex,
        summaryColumn,
      };
    });
  }, [columns, frozenColumnIndex, summary]);

  return (
    <SummaryTable variant={variant} summaryHeight={summaryHeight}>
      <TableColGroupFrozen />
      <tbody role={'rfdg-summay-frozen'}>
        <tr>
          {showLineNumber && <LineNumberTd>&nbsp;</LineNumberTd>}
          {hasRowSelection && <td>&nbsp;</td>}
          {summaryColumns.map(({ column, summaryColumn, columnIndex }, index) => {
            if (!column) return null;
            if (!summaryColumn) return <td key={index}></td>;
            return (
              <td
                key={index}
                style={{
                  textAlign: summaryColumn.align,
                }}
                colSpan={summaryColumn.colSpan ?? 1}
              >
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

const LineNumberTd = styled(HeadTd)`
  &:not(:last-child) {
    border-right: 1px solid var(--axdg-border-color-base);
  }
`;
