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
  const hasRowSelection = useAppStore(s => !!s.rowSelection);
  const headerHeight = useAppStore(s => s.headerHeight);
  const columns = useAppStore(s => s.columns);
  const frozenColumnsGroup = useAppStore(s => s.frozenColumnsGroup);
  const selectedAll = useAppStore(s => s.selectedAll);
  const setSelectedAll = useAppStore(s => s.setSelectedAll);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);
  const columnResizing = useAppStore(s => s.columnResizing);
  const toggleColumnSort = useAppStore(s => s.toggleColumnSort);

  return (
    <HeadTableFrozen headerHeight={headerHeight}>
      <TableColGroupFrozen />
      <tbody role={'rft-head-frozen'}>
        {frozenColumnsGroup.length > 0 && (
          <tr role={'column-group'}>
            {hasRowSelection && (
              <HeadGroupTd rowSpan={2}>
                <RowSelector
                  checked={selectedAll === true}
                  indeterminate={selectedAll === 'indeterminate'}
                  handleChange={checked => {
                    setSelectedAll(checked);
                  }}
                />
              </HeadGroupTd>
            )}
            {frozenColumnsGroup.map((cg, index) => (
              <HeadGroupTd
                key={index}
                colSpan={cg.colspan}
                style={{
                  textAlign: cg.align,
                }}
              >
                {cg.label}
              </HeadGroupTd>
            ))}
          </tr>
        )}

        <tr>
          {frozenColumnsGroup.length === 0 && hasRowSelection && (
            <HeadTd>
              <RowSelector
                checked={selectedAll === true}
                indeterminate={selectedAll === 'indeterminate'}
                handleChange={checked => {
                  setSelectedAll(checked);
                }}
              />
            </HeadTd>
          )}
          {columns.slice(0, frozenColumnIndex).map((c, index) => (
            <HeadTd
              data-column-index={index}
              key={index}
              style={{
                textAlign: c.align,
              }}
              hasOnClick={sort && !c.sortDisable}
              columnResizing={columnResizing}
              onClick={evt => {
                evt.preventDefault();
                toggleColumnSort(index);
              }}
            >
              <TableHeadColumn column={c} />
              <ColResizer container={container} hideHandle={frozenColumnIndex - 1 === index} columnIndex={index} />
            </HeadTd>
          ))}
        </tr>
      </tbody>
    </HeadTableFrozen>
  );
}

const HeadTableFrozen = styled(HeadTable)``;

export default TableHeadFrozen;
