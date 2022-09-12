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
        width={600}
        height={400}
        data={list}
        columns={[
          {
            key: 'id',
            label: '아이디',
          },
          {
            key: 'title',
            label: '제목',
          },
          {
            key: 'writer',
            label: '작성자',
          },
          {
            key: 'createdAt',
            label: '작성일',
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
