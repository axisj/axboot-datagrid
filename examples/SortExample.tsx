import * as React from 'react';
import styled from '@emotion/styled';
import { AXFDataGrid, AXFDGColumn } from '../@axframe-datagrid';
import { useContainerSize } from '../hooks/useContainerSize';
import ExampleContainer from '../components/ExampleContainer';

interface Props {}

interface IListItem {
  id: string;
  title: string;
  writer: string;
  createAt: string;
}

const list = Array.from(Array(1000)).map((v, i) => ({
  values: {
    id: `ID_${i}`,
    title: `title_${i}`,
    writer: `writer_${i}`,
    createAt: `2022-09-08`,
  },
}));

function SortExample(props: Props) {
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
    },
    {
      key: 'writer',
      label: '작성자',
      width: 100,
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
        rowChecked={{
          checkedIndexes: [],
          onChange: (ids, selectedAll) => {
            console.log('onChange rowSelection', ids, selectedAll);
          },
        }}
        sort={{
          sortParams: [{ key: 'title', orderBy: 'desc' }],
          onChange: sortParams => {
            console.log('onChange: sortParams', sortParams);
          },
        }}
      />
    </Container>
  );
}

const Container = styled(ExampleContainer)``;

export default SortExample;
