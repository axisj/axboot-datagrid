import * as React from 'react';
import styled from '@emotion/styled';
import { RFTable } from '../react-frame-table';

interface Props {}

const list = Array.from(Array(100)).map(i => ({
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
      <RFTable
        width={500}
        height={400}
        data={list}
        columns={[
          {
            key: 'id',
            label: '아이디',
            width: 50,
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
            key: 'createdAt',
            label: '작성일A',
            width: 100,
          },
          {
            key: 'createdAt',
            label: '작성일B',
            width: 100,
          },
          {
            key: 'createdAt',
            label: '작성일C',
            width: 100,
          },
          {
            key: 'createdAt',
            label: '작성일D',
            width: 100,
          },
          {
            key: 'createdAt',
            label: '작성일E',
            width: 100,
          },
        ]}
        rowSelection={{
          selectedKeys: [],
          onChange: () => {},
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  font-size: 13px;
`;

export default BasicExample;
