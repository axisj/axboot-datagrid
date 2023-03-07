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
  const columns = React.useMemo(
    () =>
      [
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
            console.log('itemRender call');
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
          itemRender: ({ values }) => {
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
      ] as AXFDGColumn<any>[],
    [],
  );
  return (
    <Container ref={containerRef}>
      <AXFDataGrid<IListItem>
        width={containerWidth}
        height={containerHeight}
        data={list}
        frozenColumnIndex={2}
        headerHeight={48}
        itemHeight={24}
        itemPadding={5}
        columns={columns}
        columnsGroup={[{ label: '묶음', columnIndexes: [2, 3, 4], align: 'center' }]}
        rowChecked={{
          checkedIndexes: [],
          onChange: (ids, selectedAll) => {
            console.log('onChange rowSelection', ids, selectedAll);
          },
        }}
      />
    </Container>
  );
}

const Container = styled(ExampleContainer)`
  height: 700px;
`;

export default ColumnsGroupExample;
