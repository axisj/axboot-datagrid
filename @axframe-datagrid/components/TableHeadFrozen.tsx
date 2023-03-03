import styled from '@emotion/styled';
import * as React from 'react';
import { useAppStore } from '../store';
import RowSelector from './RowSelector';
import TableColGroupFrozen from './TableColGroupFrozen';
import { HeadGroupTd, HeadTable, HeadTd } from './TableHead';
import ColResizer from './ColResizer';
import TableHeadColumn from './TableHeadColumn';

interface Props {
  container: React.RefObject<HTMLDivElement>;
}

function TableHeadFrozen({ container }: Props) {
  const sort = useAppStore(s => s.sort);
  const hasRowSelection = useAppStore(s => !!s.rowChecked);
  const headerHeight = useAppStore(s => s.headerHeight);
  const columns = useAppStore(s => s.columns);
  const columnsGroup = useAppStore(s => s.columnsGroup);
  const selectedAll = useAppStore(s => s.checkedAll);
  const setSelectedAll = useAppStore(s => s.setCheckedAll);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const columnResizing = useAppStore(s => s.columnResizing);
  const toggleColumnSort = useAppStore(s => s.toggleColumnSort);

  const columnsTable = React.useMemo(() => {
    const hasColumnsGroup = columnsGroup.length > 0;
    const rows: Record<string, any>[] = [];

    if (hasColumnsGroup) {
      const row: Record<string, any>[] = [];
      const secondRow: Record<string, any>[] = [];
      columns.slice(0, frozenColumnIndex).forEach((column, index) => {
        const findCgIndex = columnsGroup.findIndex(cg => cg.columnIndexes.includes(index));
        if (findCgIndex > -1) {
          const prevItem = row[row.length - 1];
          if (!prevItem || prevItem.cgi !== findCgIndex) {
            const cifi = columnsGroup[findCgIndex].columnIndexes.findIndex(n => n === index);
            row.push({
              type: 'column-group',
              cgi: findCgIndex,
              colspan: columnsGroup[findCgIndex].columnIndexes.length - cifi,
              ...columnsGroup[findCgIndex],
            });
          }

          secondRow.push({
            type: 'column',
            columnIndex: index,
            ...column,
          });
        } else {
          row.push({
            type: 'column',
            columnIndex: index,
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

  return (
    <HeadTable headerHeight={headerHeight} hasGroup={columnsTable.length > 1}>
      <TableColGroupFrozen />
      <tbody role={'rfdg-head-frozen'}>
        {columnsTable.map((row, ri) => {
          return (
            <tr key={ri}>
              {ri === 0 && hasRowSelection && (
                <HeadTd rowSpan={columnsTable.length}>
                  <RowSelector
                    checked={selectedAll === true}
                    indeterminate={selectedAll === 'indeterminate'}
                    handleChange={checked => {
                      setSelectedAll(checked);
                    }}
                  />
                </HeadTd>
              )}

              {row.map((c: any, index: any) => {
                if (c.type === 'column-group') {
                  return (
                    <HeadGroupTd
                      key={index}
                      colSpan={c.colspan}
                      style={{
                        textAlign: c.headerAlign ?? c.align,
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
                    rowSpan={c.rowSpan}
                    style={{
                      textAlign: c.headerAlign ?? c.align,
                    }}
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
              <HeadTd />
            </tr>
          );
        })}
      </tbody>
    </HeadTable>
  );
}

export default TableHeadFrozen;
