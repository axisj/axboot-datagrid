import * as React from 'react';
import styled from '@emotion/styled';
import { AXFDataGrid, AXFDGDataItem } from '../@axframe-datagrid';
import ExampleContainer from '../components/ExampleContainer';
import { useContainerSize } from '../hooks/useContainerSize';
import useEditorGrid, { Item } from './useEditorGrid';
import { Button, Divider } from 'antd';

interface Props {}

function EditorExample(props: Props) {
  const { columns, handleColumnsChange, list, handleAddList } = useEditorGrid();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  return (
    <Wrap>
      <Buttons>
        <Button size={'small'} type='primary' onClick={handleAddList}>
          Add
        </Button>
        <Button size={'small'}>Remove</Button>
        <Divider type='vertical' />
        <Button size={'small'} type='default'>
          Save
        </Button>
      </Buttons>

      <Container ref={containerRef}>
        <AXFDataGrid<Item>
          width={containerWidth}
          height={containerHeight}
          data={list}
          columns={columns}
          onChangeColumns={handleColumnsChange}
          rowChecked={{
            checkedIndexes: [],
            onChange: (ids, selectedAll) => {
              console.log('onChange rowSelection', ids, selectedAll);
            },
          }}
          onClick={item => console.log(item)}
          editable
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

export default EditorExample;
