import { Divider, Radio } from 'antd';
import { useEffect, useState } from 'react';
import * as React from 'react';
import styled from '@emotion/styled';
import { AXDataGrid, AXDGColumn, AXDGProps } from '../@axboot-datagrid';
import { useContainerSize } from '../hooks/useContainerSize';
import ExampleContainer from '../components/ExampleContainer';

interface Props {}

interface IListItem {
  id?: string;
  class?: string;
  title?: string;
  writer?: string;
  createAt?: string;
}

const list = Array.from(Array(50)).map((v, i) => ({
  values: {
    id: `ID_${i}`,
    class: `class_${Math.floor(i / 5)}`,
    title: `title_${i}`,
    writer: `writer_${i}`,
    createAt: `2022-09-08`,
  },
}));

const summary1: AXDGProps<any>['summary'] = {
  position: 'top',
  columns: [
    {
      columnIndex: 0,
      align: 'center',
      itemRender: ({ data }) => {
        return <>합계</>;
      },
    },
    {
      columnIndex: 2,
      itemRender: ({ data }) => {
        return <>Summary</>;
      },
    },
    {
      columnIndex: 3,
      colSpan: 2,
      itemRender: ({ data }) => {
        return <>COUNT : {data.length}</>;
      },
    },
  ],
};

const summary2: AXDGProps<any>['summary'] = {
  position: 'bottom',
  columns: [
    {
      columnIndex: 0,
      align: 'center',
      itemRender: ({ data }) => {
        return <>합계</>;
      },
    },
    {
      columnIndex: 2,
      colSpan: 2,
      align: 'right',
      itemRender: ({ data }) => {
        return <>Summary</>;
      },
    },
    {
      columnIndex: 5,
      colSpan: 2,
      itemRender: ({ data }) => {
        return <>Summary</>;
      },
    },
  ],
};

function SummaryExample(props: Props) {
  const [summaryKey, setSummaryKey] = useState('summary1');
  const [summary, setSummary] = useState<AXDGProps<any>['summary']>();
  const [columns, setColumns] = React.useState<AXDGColumn<IListItem>[]>([
    {
      key: 'class',
      label: 'class',
      width: 100,
      align: 'center',
    },
    {
      key: 'id',
      label: 'No',
      width: 100,
    },
    {
      key: 'title',
      label: 'Title',
      width: 300,
      itemRender: ({ values }) => {
        return (
          <>
            {values.writer} / {values.title}
          </>
        );
      },
    },
    {
      key: 'writer',
      label: 'Writer',
      width: 100,
      itemRender: ({ values: values }) => {
        return <>{values.writer} / A</>;
      },
    },
    {
      key: 'createAt',
      label: 'Date-A',
      width: 100,
      align: 'center',
    },
    {
      key: 'createAt',
      label: 'Date-B',
      width: 100,
      align: 'center',
    },
    {
      key: 'createAt',
      label: 'Date-C',
      width: 100,
      align: 'center',
    },
    {
      key: 'createAt',
      label: 'Date-D',
      width: 100,
    },
    {
      key: 'createAt',
      label: 'Date-E',
      width: 100,
    },
  ]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  useEffect(() => {
    setSummary(summaryKey === 'summary1' ? summary1 : summary2);
  }, [summaryKey]);

  return (
    <>
      <Radio.Group
        style={{ marginBottom: 10 }}
        options={[
          { label: 'TOP', value: 'summary1' },
          { label: 'Bottom', value: 'summary2' },
        ]}
        onChange={e => {
          setSummaryKey(e.target.value);
        }}
        value={summaryKey}
      />

      <Container ref={containerRef}>
        <AXDataGrid<IListItem>
          showLineNumber
          rowChecked={{
            checkedIndexes: [],
            onChange: (ids, selectedAll) => {
              console.log('onChange rowSelection', ids, selectedAll);
            },
          }}
          frozenColumnIndex={1}
          width={containerWidth}
          height={containerHeight}
          data={list}
          columns={columns}
          onChangeColumns={(columnIndex, width, columns) => {
            console.log('onChangeColumnWidths', columnIndex, width, columns);
            setColumns(columns);
          }}
          cellMergeOptions={{
            columnsMap: {
              0: { mergeBy: 'class' },
              4: { mergeBy: 'class' },
              5: { mergeBy: 'class' },
              6: { mergeBy: 'class' },
            },
          }}
          onClick={item => console.log(item)}
          variant={'vertical-bordered'}
          summary={summary}
        />
      </Container>
    </>
  );
}

const Container = styled(ExampleContainer)``;

export default SummaryExample;
