import { css } from '@emotion/react';
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
    let ignoreColumnCnt = 0;
    return columns.slice(frozenColumnIndex).map((column, index) => {
      const columnIndex = frozenColumnIndex + index;
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
      <TableColGroup />
      <tbody role={'rfdg-summary'}>
        <tr>
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

export const SummaryTable = styled.table<{ summaryHeight: number; variant: AXDGProps<any>['variant'] }>`
  table-layout: fixed;
  width: 100%;
  border-collapse: unset;
  border-spacing: 0;
  height: ${p => p.summaryHeight}px;
  color: var(--axdg-header-color);
  font-weight: var(--axdg-header-font-weight);

  > tbody > tr > td {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    padding: 0 6.5px;

    ${({ variant }) => {
      if (variant === 'vertical-bordered') {
        return css`
          border-right: 1px solid var(--axdg-border-color-light, var(--axdg-border-color-base));
        `;
      }
    }}
  }
`;
