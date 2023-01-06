import * as React from 'react';
import { AXFDGColumn, AXFDGDataItem } from '../@axframe-datagrid';
import { v4 as uuidv4 } from 'uuid';

export interface Item {
  status: string;
  uuid: string;
  code?: string;
  codeValue?: string;
}

export const CellInputEditor = () => {
  return <div>CellInputEditor</div>;
};

export default function useEditorGrid() {
  const [list, setList] = React.useState<AXFDGDataItem<Item>[]>([]);
  const [colWidths, setColWidths] = React.useState<number[]>([]);

  const handleColumnsChange = React.useCallback((columnIndex: number, width: number, columns: AXFDGColumn<Item>[]) => {
    setColWidths(columns.map(column => column.width));
  }, []);

  const handleAddList = React.useCallback(() => {
    setList([
      ...list,
      {
        values: {
          uuid: uuidv4(),
          status: 'new',
        },
      },
    ]);
  }, [list]);

  const columns = React.useMemo(
    () =>
      (
        [
          { key: 'uuid', label: 'UUID', width: 150 },
          {
            key: 'code',
            label: 'Code',
            width: 150,
            itemRender: CellInputEditor,
          },
          {
            key: 'codeValue',
            label: 'Value',
            width: 100,
          },
          {
            key: 'computed',
            label: 'ComputedValue',
            width: 200,
          },
        ] as AXFDGColumn<Item>[]
      ).map((column, colIndex) => {
        if (colWidths.length > 0) {
          column.width = colWidths[colIndex];
        }
        return column;
      }),
    [colWidths],
  );

  return {
    handleColumnsChange,
    columns,
    list,
    handleAddList,
  };
}


const FN: React.FC<{}> = () => {
  return <div>ssss</div>
}
