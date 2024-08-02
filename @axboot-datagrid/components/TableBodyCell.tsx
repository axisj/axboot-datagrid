import * as React from 'react';
import { AXDGColumn, AXDGDataItem, MoveDirection } from '../types';

interface Props<T> {
  index: number;
  columnIndex: number;
  column: AXDGColumn<T>;
  item: AXDGDataItem<any>;
  valueByRowKey: any;
  handleSave?: (value: any, columnDirection?: MoveDirection, rowDirection?: MoveDirection) => void;
  handleCancel?: () => void;
  handleMove?: (columnDirection: MoveDirection, rowDirection: MoveDirection) => void;
  editable?: boolean;
}

function Cell<T>({
  index,
  columnIndex,
  column,
  item,
  valueByRowKey,
  handleSave,
  handleCancel,
  handleMove,
  editable,
}: Props<T>) {
  if (column.itemRender) {
    const Render = column.itemRender;
    return (
      <Render
        item={item}
        values={item.values}
        value={valueByRowKey}
        column={column}
        index={index}
        columnIndex={columnIndex}
        handleSave={handleSave}
        handleCancel={handleCancel}
        handleMove={handleMove}
        editable={editable}
      />
    );
  } else {
    return valueByRowKey;
  }
}

const TableBodyCell = React.memo(Cell);

export { TableBodyCell };
