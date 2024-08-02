import * as React from 'react';
import styled from '@emotion/styled';
import { AXDataGrid, AXDGColumn } from '../@axboot-datagrid';
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

export default function GetRowClassName(props: Props) {
  const [selectedRowKey, setSelectedRowKey] = React.useState<number>();
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
      label: '작성일',
      width: 100,
      sortDisable: true,
    },
  ]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  return (
    <>
      <Container ref={containerRef}>
        <AXDataGrid<IListItem>
          showLineNumber
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
          getRowClassName={(ri, item) => {
            if (item.values.no < 3) {
              return 'notice-tr';
            }
          }}
        />
      </Container>
    </>
  );
}

const Container = styled(ExampleContainer)`
  .notice-tr {
    background-color: #ffefc2;
  }
`;
