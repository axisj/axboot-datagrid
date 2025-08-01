import * as React from 'react';
import styled from '@emotion/styled';
import { AXDataGrid } from '../@axboot-datagrid';
import { useContainerSize } from '../hooks/useContainerSize';
import ExampleContainer from '../components/ExampleContainer';

interface Props {}

interface IListItem {
  id: string;
  title: string;
  writer: string;
  createAt: string;
}

const list = Array.from(Array(100)).map((v, i) => ({
  values: {
    id: `ID_${i}`,
    title: `title_${i}`,
    writer: `writer_${i}`,
    createAt: `2022-09-08`,
  },
}));

function ColumnsGroupExample(props: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  return (
    <Container ref={containerRef}>
      <AXDataGrid<IListItem>
        width={containerWidth}
        height={containerHeight}
        data={list}
        frozenColumnIndex={3}
        headerHeight={50}
        itemHeight={50}
        itemPadding={5}
        columns={[
          {
            key: 'id',
            label: '아이디 IS LONG !',
            width: 100,
          },
          {
            key: 'title',
            label: '제목',
            align: 'center',
            width: 120,
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
        ]}
        columnsGroup={[{ label: '묶음', groupStartIndex: 2, groupEndIndex: 4, align: 'center' }]}
        rowChecked={{
          checkedIndexes: [],
          onChange: (ids, selectedAll) => {
            console.log('onChange rowSelection', ids, selectedAll);
          },
        }}
        showLineNumber
      />
    </Container>
  );
}

const Container = styled(ExampleContainer)`
  height: 500px;
`;

export default ColumnsGroupExample;
