import * as React from 'react';
import { AXFDGColumn, AXFDGDataItem, AXFDGDataItemStatus } from '../@axframe-datagrid';
import { v4 as uuidv4 } from 'uuid';
import { DateEditor, InputEditor, SelectEditor } from './editors';

export interface Item {
  uuid: string;
  code?: string;
  useYn?: string;
  selectDate?: string;
  startDate?: string;
  endDate?: string;
}

export default function useEditorGrid() {
  const [list, setList] = React.useState<AXFDGDataItem<Item>[]>([
    {
      values: {
        uuid: uuidv4(),
        code: 'S0001',
        useYn: 'Y',
        selectDate: '',
        startDate: '',
        endDate: '',
      },
    },
    {
      values: {
        uuid: uuidv4(),
        code: 'S0002',
        useYn: 'Y',
        selectDate: '',
        startDate: '',
        endDate: '',
      },
    },
  ]);
  const [colWidths, setColWidths] = React.useState<number[]>([]);
  const [selectedKeys, setSelectedKeys] = React.useState<React.Key[]>([]);

  const handleColumnsChange = React.useCallback((columnIndex: number, width: number, columns: AXFDGColumn<Item>[]) => {
    setColWidths(columns.map(column => column.width));
  }, []);

  const handleAddList = React.useCallback(() => {
    setList([
      ...list,
      {
        status: AXFDGDataItemStatus.new,
        values: {
          uuid: uuidv4(),
          code: 'S0001',
          useYn: 'Y',
          selectDate: '',
          startDate: '',
          endDate: '',
        },
      },
    ]);
  }, [list]);

  const handleRemoveList = React.useCallback(() => {
    setList(list.filter(n => !selectedKeys.includes(n.values['uuid'])));

    setList(
      list
        .map(item => {
          if (selectedKeys.includes(item.values['uuid'])) {
            if (item.status === AXFDGDataItemStatus.new) {
              return false;
            }
            return {
              status: AXFDGDataItemStatus.remove,
              values: item.values,
            };
          }

          return item;
        })
        .filter(Boolean) as AXFDGDataItem<Item>[],
    );
    setSelectedKeys([]);
  }, [list, selectedKeys]);

  const columns = React.useMemo(
    () =>
      (
        [
          {
            key: '_',
            label: 'Status',
            width: 60,
            align: 'center',
            itemRender: ({ item }) => {
              return item.status !== undefined ? AXFDGDataItemStatus[item.status] : '';
            },
          },
          { key: 'uuid', label: 'UUID', width: 150 },
          {
            key: 'code',
            label: 'Code',
            width: 150,
            itemRender: InputEditor,
          },
          {
            key: 'useYn',
            label: 'USE_YN',
            width: 100,
            itemRender: SelectEditor,
          },
          {
            key: 'selectDate',
            label: 'DatePicker',
            width: 150,
            itemRender: DateEditor,
          },
          // {
          //   key: 'dateRange',
          //   label: 'RangePicker',
          //   width: 250,
          //   itemRender: getDateRangeEditor(['startDate', 'endDate']),
          // },
          {
            key: 'computed',
            label: 'ComputedValue',
            width: 200,
            itemRender: ({ editable, item, column, values, handleSave, handleCancel }) => {
              return values.code + '/' + values.useYn;
            },
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
    selectedKeys,
    setSelectedKeys,
    handleRemoveList,
  };
}
