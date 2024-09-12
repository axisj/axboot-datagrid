import * as React from 'react';
import styled from '@emotion/styled';
import { AXDataGrid, AXDGColumn } from '../@axboot-datagrid';
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

function SummaryExample(props: Props) {
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

  return (
    <Container ref={containerRef}>
      <AXDataGrid<IListItem>
        showLineNumber
        frozenColumnIndex={0}
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
        summary={{
          position: 'top',
          columns: [
            {
              columnIndex: 2,
              colSpan: 2,
              itemRender: ({ data }) => {
                return <div>Summary</div>;
              },
            },
            {
              columnIndex: 5,
              colSpan: 2,
              itemRender: ({ data }) => {
                return <div>Summary</div>;
              },
            },
          ],
        }}
      />
    </Container>
  );
}

const Container = styled(ExampleContainer)``;

export default SummaryExample;
