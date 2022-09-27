import * as React from 'react';
import styled from '@emotion/styled';
import { RFDataGrid, RFDGColumn } from '../react-frame-datagrid';
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

function PagingExample(props: Props) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [columns, setColumns] = React.useState<RFDGColumn<IListItem>[]>([
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
  const [width, setWidth] = React.useState(600);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.clientWidth);
    }
  }, []);

  return (
    <Container ref={containerRef}>
      <RFDataGrid<IListItem>
        width={width}
        height={300}
        headerHeight={35}
        data={list}
        columns={columns}
        page={{
          currentPage: currentPage,
          pageSize: 50,
          totalPages: 10,
          totalElements: 498,
          loading: false,
          onChange: (pageNo, pageSize) => {
            console.log(pageNo, pageSize);
            setCurrentPage(pageNo);
          },
          displayPaginationLength: 5,
        }}
        onClick={({ item, itemIndex, columnIndex, column }) => {
          console.log('click tr', item, itemIndex, columnIndex, column);
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  font-size: 13px;
`;

export default PagingExample;
