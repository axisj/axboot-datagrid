import * as React from 'react';
import styled from '@emotion/styled';
import { AXFDataGrid, AXFDGColumn } from '../@axframe-datagrid';
import ExampleContainer from '../components/ExampleContainer';
import { useContainerSize } from '../hooks/useContainerSize';

interface Props {}

interface IListItem {
  no: number;
  id: string;
  title: string;
  writer: string;
  createAt: string;
}

const list = Array.from(Array(1000)).map((v, i) => ({
  values: {
    no: i,
    id: `ID_${i}`,
    title: `title_${i}`,
    writer: `writer_${i}`,
    createAt: `2022-09-08`,
  },
}));

export default function FocusExample(props: Props) {
  const [selectedRowKey, setSelectedRowKey] = React.useState<number>();
  const [columns, setColumns] = React.useState<AXFDGColumn<IListItem>[]>([
    {
      key: 'id',
      label: '아이디 IS LONG !',
      width: 100,
    },
    {
      key: 'title',
      label: '제목',
      width: 300,
      itemRender: item => {
        return `${item.writer}//${item.title}`;
      },
    },
    {
      key: 'writer',
      label: '작성자',
      width: 100,
      itemRender: item => {
        return `${item.writer}//A`;
      },
    },
    {
      key: 'createAt',
      label: '작성일',
      width: 100,
      sortDisable: true,
    },
  ]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  return (
    <Container ref={containerRef}>
      <AXFDataGrid<IListItem>
        width={containerWidth}
        height={containerHeight}
        headerHeight={35}
        data={list}
        columns={columns}
        onChangeColumns={(columnIndex, width, columns) => {
          console.log('onChangeColumnWidths', columnIndex, width, columns);
          setColumns(columns);
        }}
        onClick={({ item }) => {
          // console.log('item.id', item.id);
          setSelectedRowKey(item.no);
        }}
        rowKey={'no'}
        selectedRowKey={selectedRowKey}
      />
      <br />
      <b>selectedRowKey</b> : {selectedRowKey}
    </Container>
  );
}

const Container = styled(ExampleContainer)``;
