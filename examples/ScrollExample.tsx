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

const list = Array.from(Array(500)).map((v, i) => ({
  values: {
    id: `ID_${i}`,
    title: `title_${i}`,
    writer: `writer_${i}`,
    createAt: `2022-09-08`,
  },
}));

function ScrollExample(props: Props) {
  const [columns, setColumns] = React.useState<AXFDGColumn<IListItem>[]>(
    Array.from({ length: 100 }, _ => {
      return [
        {
          key: 'id',
          label: '아이디',
          width: 100,
        },
        {
          key: 'title',
          label: '제목',
          width: 100,
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
        },
      ];
    }).flat(),
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  return (
    <Container ref={containerRef}>
      <AXFDataGrid<IListItem>
        width={containerWidth}
        height={containerHeight}
        data={list}
        columns={columns}
        rowChecked={{
          checkedIndexes: [],
          onChange: (ids, selectedAll) => {
            console.log('onChange rowSelection', ids, selectedAll);
          },
        }}
        onClick={item => console.log(item)}
        page={{
          totalElements: list.length,
        }}
      />
    </Container>
  );
}

const Container = styled(ExampleContainer)``;

export default ScrollExample;
