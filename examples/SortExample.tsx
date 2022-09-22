import * as React from 'react';
import styled from '@emotion/styled';
import { RFTable, RFTableColumn } from '../react-frame-table';
import { Button } from 'antd';

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
  const [columns, setColumns] = React.useState<RFTableColumn<IListItem>[]>([
    {
      key: 'id',
      label: '아이디 IS LONG !',
      width: 100,
      sortDisable: true,
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
    },
  ]);

  return (
    <Container>
      <RFTable<IListItem>
        width={1000}
        height={400}
        headerHeight={35}
        data={list}
        columns={columns}
        onChangeColumns={(columnIndex, width, columns) => {
          console.log('onChangeColumnWidths', columnIndex, width, columns);
          setColumns(columns);
        }}
        rowSelection={{
          selectedIds: [],
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

const Container = styled.div`
  font-size: 13px;
`;

export default SortExample;
