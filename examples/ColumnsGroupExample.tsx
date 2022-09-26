import * as React from 'react';
import styled from '@emotion/styled';
import { RFDataGrid } from '../react-frame-datagrid';

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
  return (
    <Container>
      <RFDataGrid<IListItem>
        width={1000}
        height={700}
        data={list}
        frozenColumnIndex={2}
        headerHeight={60}
        itemHeight={24}
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
        columnsGroup={[
          { label: '구분1', colspan: 2, align: 'center' },
          { label: '구분2', colspan: 2 },
          { label: '구분3', colspan: 4 },
        ]}
        rowSelection={{
          selectedIds: [],
          onChange: (ids, selectedAll) => {
            console.log('onChange rowSelection', ids, selectedAll);
          },
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  font-size: 13px;
`;

export default ColumnsGroupExample;
