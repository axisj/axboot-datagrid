import styled from '@emotion/styled';
import * as React from 'react';
import { useAppStore } from '../store';
import RowSelector from './RowSelector';
import TableColGroupFrozen from './TableColGroupFrozen';
import { HeadTable } from './TableHead';
import ColResizer from './ColResizer';

interface Props {
  container: React.RefObject<HTMLDivElement>;
}

function TableHeadFrozen({ container }: Props) {
  const hasRowSelection = useAppStore(s => !!s.rowSelection);
  const headerHeight = useAppStore(s => s.headerHeight);
  const columns = useAppStore(s => s.columns);
  const frozenColumnsGroup = useAppStore(s => s.frozenColumnsGroup);
  const selectedAll = useAppStore(s => s.selectedAll);
  const setSelectedAll = useAppStore(s => s.setSelectedAll);
  const frozenColumnIndex = useAppStore(s => s.frozenColumnIndex);

  return (
    <HeadTableFrozen headerHeight={headerHeight}>
      <TableColGroupFrozen />
      <tbody role={'react-frame-table-head-frozen'}>
        {frozenColumnsGroup.length > 0 && (
          <tr role={'column-group'}>
            {hasRowSelection && (
              <td rowSpan={2}>
                <RowSelector
                  checked={selectedAll === true}
                  indeterminate={selectedAll === 'indeterminate'}
                  handleChange={checked => {
                    setSelectedAll(checked);
                  }}
                />
              </td>
            )}
            {frozenColumnsGroup.map((cg, index) => (
              <td
                key={index}
                colSpan={cg.colspan}
                style={{
                  textAlign: cg.align,
                }}
              >
                {cg.label}
              </td>
            ))}
          </tr>
        )}

        <tr>
          {frozenColumnsGroup.length === 0 && hasRowSelection && (
            <td>
              <RowSelector
                checked={selectedAll === true}
                indeterminate={selectedAll === 'indeterminate'}
                handleChange={checked => {
                  setSelectedAll(checked);
                }}
              />
            </td>
          )}
          {columns.slice(0, frozenColumnIndex).map((c, index) => (
            <td
              data-column-index={index}
              key={index}
              style={{
                textAlign: c.align,
              }}
            >
              {c.label}
              <ColResizer container={container} hideHandle={frozenColumnIndex - 1 === index} columnIndex={index} />
            </td>
          ))}
        </tr>
      </tbody>
    </HeadTableFrozen>
  );
}

const HeadTableFrozen = styled(HeadTable)``;

export default TableHeadFrozen;
