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

function LineNumberExample(props: Props) {
  const [columns, setColumns] = React.useState<AXDGColumn<IListItem>[]>([
    {
      key: 'id',
      label: '아이디 IS LONG !',
      width: 100,
    },
    {
      key: 'title',
      label: '제목',
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
      label: '작성자',
      width: 100,
      itemRender: ({ values: values }) => {
        return <>{values.writer} / A</>;
      },
    },
    {
      key: 'createAt',
      label: '작성일A',
      width: 100,
    },
    {
      key: 'createAt',
      label: '작성일B',
      width: 100,
    },
    {
      key: 'createAt',
      label: '작성일C',
      width: 100,
    },
    {
      key: 'createAt',
      label: '작성일D',
      width: 100,
    },
    {
      key: 'createAt',
      label: '작성일E',
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
        onChangeColumns={(columnIndex, width, columns) => {
          console.log('onChangeColumnWidths', columnIndex, width, columns);
          setColumns(columns);
        }}
        // rowChecked={{
        //   checkedIndexes: [],
        //   onChange: (ids, selectedAll) => {
        //     console.log('onChange rowSelection', ids, selectedAll);
        //   },
        // }}
        onClick={item => console.log(item)}
        showLineNumber
      />
    </Container>
  );
}

const Container = styled(ExampleContainer)``;

export default LineNumberExample;
