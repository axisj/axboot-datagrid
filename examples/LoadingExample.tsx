import * as React from 'react';
import styled from '@emotion/styled';
import { RFTable, RFTableColumn } from '../react-frame-table';
import { Button, Divider } from 'antd';

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

function LoadingExample(props: Props) {
  const [loading, setLoading] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);
  const [width, setWidth] = React.useState(800);
  const [height, setHeight] = React.useState(300);
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
        width={width}
        height={height}
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
        loading={loading}
        spinning={spinning}
      />

      <br />

      <Button onClick={() => setLoading(true)}>Loading : true</Button>
      <Divider type='vertical' />
      <Button onClick={() => setLoading(false)}>Loading : false</Button>
      <Divider type='vertical' />
      <Button onClick={() => setSpinning(true)}>Spinning : true</Button>
      <Divider type='vertical' />
      <Button onClick={() => setSpinning(false)}>Spinning : false</Button>
    </Container>
  );
}

const Container = styled.div`
  font-size: 13px;
`;

export default LoadingExample;
