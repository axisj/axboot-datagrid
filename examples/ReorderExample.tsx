import * as React from 'react';
import styled from '@emotion/styled';
import { AXDataGrid, AXDGColumn, AXDGDataItemStatus } from '../@axboot-datagrid';
import { useContainerSize } from '../hooks/useContainerSize';
import ExampleContainer from '../components/ExampleContainer';
import { useState } from 'react';

interface Props {}

interface IListItem {
  id: string;
  title: string;
  writer: string;
  createAt: string;
}

const _list = Array.from(Array(100)).map((v, i) => ({
  values: {
    id: `ID_${i}`,
    title: `title_${i}`,
    writer: `writer_${i}`,
    createAt: `2022-09-08`,
  },
}));

export default function ReorderExample(props: Props) {
  const [columns, setColumns] = useState<AXDGColumn<IListItem>[]>([
    {
      key: '_',
      label: '상태',
      width: 50,
      align: 'center',
      itemRender: ({ item }) => {
        return <>{item.status !== undefined ? AXDGDataItemStatus[item.status] : ''}</>;
      },
      getClassName: item => {
        return item.status ? 'editable' : '';
      },
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
    },
    {
      key: 'createAt',
      label: 'Date-B',
      width: 100,
    },
    {
      key: 'createAt',
      label: 'Date-C',
      width: 100,
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
  const [list, setList] = useState(_list);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  return (
    <Container ref={containerRef}>
      <AXDataGrid<IListItem>
        width={containerWidth}
        height={containerHeight}
        data={list}
        columns={columns}
        onClick={item => console.log(item)}
        columnSortable={false}
        showLineNumber
        reorder={{
          enabled: true, // Set to true to enable drag-and-drop reordering
          onReorder: data => {
            // console.log('Reordered data:', data);
            setList(data);
            return true;
          },
        }}
      />
    </Container>
  );
}

const Container = styled(ExampleContainer)`
  .editable {
    background: rgba(255, 253, 158, 0.5);
    user-select: none;
    input,
    select {
      user-select: all;
    }
  }
`;
