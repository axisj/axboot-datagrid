import styled from '@emotion/styled';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import RowSelector from './RowSelector';
import TableColGroupFrozen from './TableColGroupFrozen';
import { HeadGroupTd, HeadTable, HeadTd } from './TableHead';
import ColResizer from './ColResizer';
import TableHeadColumn from './TableHeadColumn';
import Sortable from 'sortablejs';

interface Props {
  container: React.RefObject<HTMLDivElement>;
}

function TableHeadFrozen({ container }: Props) {
  const sort = useAppStore(s => s.sort);
  const hasRowSelection = useAppStore(s => !!s.rowChecked);
  const isRadio = useAppStore(s => s.rowChecked?.isRadio);
  const showLineNumber = useAppStore(s => s.showLineNumber);
  const headerHeight = useAppStore(s => s.headerHeight);
  const columns = useAppStore(s => s.columns);
  const columnsGroup = useAppStore(s => s.columnsGroup);
  const selectedAll = useAppStore(s => s.checkedAll);
  const setSelectedAll = useAppStore(s => s.setCheckedAll);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const columnResizing = useAppStore(s => s.columnResizing);
  const toggleColumnSort = useAppStore(s => s.toggleColumnSort);
  const sortColumns = useAppStore(s => s.sortColumn);
  const columnSortable = useAppStore(s => s.columnSortable);
  const [sorted, setSorted] = useState(false);
  const tbodyRef = React.useRef<HTMLTableSectionElement>(null);

  const columnsTable = React.useMemo(() => {
    const hasColumnsGroup = columnsGroup.length > 0;
    const rows: Record<string, any>[] = [];

    if (hasColumnsGroup) {
      const row: Record<string, any>[] = [];
      const secondRow: Record<string, any>[] = [];
      columns.slice(0, frozenColumnIndex).forEach((column, index) => {
        const ci = index;
        const findCgIndex = columnsGroup.findIndex(cg => cg.groupStartIndex <= ci && cg.groupEndIndex >= ci);
        if (findCgIndex > -1) {
          const prevItem = row[row.length - 1];
          if (!prevItem || prevItem.cgi !== findCgIndex) {
            const colspan =
              Math.max(columnsGroup[findCgIndex].groupEndIndex, frozenColumnIndex) -
              columnsGroup[findCgIndex].groupStartIndex +
              1;
            row.push({
              type: 'column-group',
              cgi: findCgIndex,
              columnIndex: ci,
              colspan,
              ...columnsGroup[findCgIndex],
            });
          }

          secondRow.push({
            type: 'column',
            columnIndex: ci,
            ...column,
          });
        } else {
          row.push({
            type: 'column',
            columnIndex: ci,
            ...column,
            rowspan: 2,
          });
        }
      });

      rows.push(row, secondRow);
    } else {
      const row: Record<string, any>[] = [];
      columns.slice(0, frozenColumnIndex).forEach((column, index) => {
        row.push({
          type: 'column',
          columnIndex: index,
          ...column,
        });
      });
      rows.push(row);
    }

    return rows;
  }, [columns, columnsGroup, frozenColumnIndex]);

  useEffect(() => {
    if (!sorted && columnSortable) {
      const tbody = tbodyRef.current;
      if (tbody) {
        columnsTable.forEach((row, ri) => {
          const el = tbody.querySelector(`[data-columns-tr="${ri}"]`);
          if (!el) return;

          row['sortable']?.destroy();
          row['sortable'] = Sortable.create(el as HTMLElement, {
            animation: 150,
            draggable: '.drag-item',
            onSort: evt => {
              if (evt.oldIndex === evt.newIndex) return;
              if (evt.oldIndex === undefined || evt.newIndex === undefined) return;

              sortColumns(
                ri,
                { index: evt.oldIndex, columnIndex: row[evt.oldIndex].columnIndex },
                { index: evt.newIndex, columnIndex: row[evt.newIndex].columnIndex },
              );

              setSorted(true);
            },
          });
        });
      }
    }

    return () => {};
  }, [columnSortable, columnsTable, sortColumns, sorted]);

  useEffect(() => {
    setSorted(false);
  }, [sorted]);

  if (sorted) {
    return null;
  }

  return (
    <HeadTable headerHeight={headerHeight} hasGroup={columnsTable.length > 1} rowLength={columnsTable.length}>
      <TableColGroupFrozen />
      <tbody role={'rfdg-head-frozen'} ref={tbodyRef}>
        {columnsTable.map((row, ri) => {
          return (
            <tr key={ri} data-columns-tr={ri}>
              {ri === 0 && showLineNumber && <LineNumberTd rowSpan={columnsTable.length}>&nbsp;</LineNumberTd>}
              {ri === 0 && hasRowSelection && (
                <HeadTd rowSpan={columnsTable.length} className={frozenColumnIndex > 0 ? 'bordered' : ''}>
                  {!isRadio && (
                    <RowSelector
                      checked={selectedAll === true}
                      indeterminate={selectedAll === 'indeterminate'}
                      handleChange={checked => {
                        setSelectedAll(checked);
                      }}
                    />
                  )}
                </HeadTd>
              )}

              {row.map((c: any, index: any) => {
                if (c.type === 'column-group') {
                  return (
                    <HeadGroupTd
                      key={index}
                      data-column-index={c.columnIndex}
                      colSpan={c.colspan}
                      className={'drag-item ' + c.headerClassName}
                      style={{
                        textAlign: c.headerAlign ?? 'center',
                      }}
                    >
                      {c.label}
                    </HeadGroupTd>
                  );
                }
                return (
                  <HeadTd
                    data-column-index={c.columnIndex}
                    key={index}
                    rowSpan={c.rowspan}
                    style={{
                      textAlign: c.headerAlign ?? 'center',
                    }}
                    className={'drag-item ' + c.headerClassName}
                    hasOnClick={sort && !c.sortDisable}
                    columnResizing={columnResizing}
                    onClick={evt => {
                      evt.preventDefault();
                      toggleColumnSort(index);
                    }}
                  >
                    <TableHeadColumn column={c} />
                    <ColResizer columnIndex={c.columnIndex} container={container} bordered={columnsTable.length > 1} />
                  </HeadTd>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </HeadTable>
  );
}

const LineNumberTd = styled(HeadTd)`
  &:not(:last-child) {
    border-right: 1px solid var(--axdg-border-color-base);
  }
`;

export default TableHeadFrozen;
