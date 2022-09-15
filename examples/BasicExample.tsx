import * as React from 'react';
import styled from '@emotion/styled';
import { RFTable } from '../react-frame-table';

interface Props {}

interface IListItem {
  id: string;
  title: string;
  writer: string;
  createAt: string;
}

const list = Array.from(Array(50)).map((v, i) => ({
  values: {
    id: `ID_${i}`,
    title: `title_${i}`,
    writer: `writer_${i}`,
    createAt: `2022-09-08`,
  },
}));

function BasicExample(props: Props) {
  return (
    <Container>
      <RFTable<IListItem>
        width={600}
        height={400}
        data={list}
        columns={[
          {
            key: 'id',
            label: '아이디 IS LONG !',
            width: 50,
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

export default BasicExample;
