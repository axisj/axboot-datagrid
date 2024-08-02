import * as React from 'react';
import styled from '@emotion/styled';
import { AXDataGrid, AXDGColumn } from '../@axboot-datagrid';
import { Button, Space } from 'antd';
import ExampleContainer from '../components/ExampleContainer';
import { useContainerSize } from '../hooks/useContainerSize';

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
  const [columns, setColumns] = React.useState<AXDGColumn<IListItem>[]>([
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
  ]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  return (
    <Wrap>
      <Buttons>
        <Button onClick={() => setLoading(true)}>Loading : true</Button>
        <Button onClick={() => setLoading(false)}>Loading : false</Button>
        <Button onClick={() => setSpinning(true)}>Spinning : true</Button>
        <Button onClick={() => setSpinning(false)}>Spinning : false</Button>
      </Buttons>

      <Container ref={containerRef}>
        <AXDataGrid<IListItem>
          width={containerWidth}
          height={containerHeight}
          headerHeight={35}
          data={list}
          columns={columns}
          onChangeColumns={(columnIndex, width, columns) => {
            console.log('onChangeColumnWidths', columnIndex, width, columns);
            setColumns(columns);
          }}
          rowChecked={{
            checkedIndexes: [],
            onChange: (ids, selectedAll) => {
              console.log('onChange rowSelection', ids, selectedAll);
            },
          }}
          loading={loading}
          spinning={spinning}
        />
      </Container>
    </Wrap>
  );
}

const Wrap = styled.div``;
const Container = styled(ExampleContainer)``;
const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 10px 0;
  justify-content: flex-start;
  align-items: center;
`;

export default LoadingExample;
