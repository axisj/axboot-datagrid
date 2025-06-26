import * as React from 'react';
import styled from '@emotion/styled';
import { AXDataGrid, AXDGColumn } from '../@axboot-datagrid';
import { useContainerSize } from '../hooks/useContainerSize';
import ExampleContainer from '../components/ExampleContainer';

interface Props {}

interface IListItem {
  id: string;
  title: string;
  writer: string;
  createAt: string;
}

const list = Array.from(Array(5)).map((v, i) => ({
  values: {
    id: `ID_${i}`,
    title: `title_${i}`,
    writer: `writer_${i}`,
    createAt: `2022-09-08`,
  },
}));

export default function DnDExample(props: Props) {
  const [columns, setColumns] = React.useState<AXDGColumn<IListItem>[]>([
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

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  return (
    <Container ref={containerRef}>
      <AXDataGrid<IListItem>
        width={containerWidth}
        height={containerHeight}
        data={list}
        columns={columns}
        onChangeColumns={(columnIndex, { width, columns }) => {
          console.log('onChangeColumnWidths', columnIndex, width, columns);
          setColumns(columns);
        }}
        onClick={item => console.log(item)}
        columnSortable
        showLineNumber
        reorder={{
          enabled: true, // Set to true to enable drag-and-drop reordering
        }}
      />
    </Container>
  );
}

const Container = styled(ExampleContainer)``;
