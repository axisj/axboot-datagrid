import * as React from 'react';
import styled from '@emotion/styled';
import { AXDataGrid } from '../@axboot-datagrid';
import ExampleContainer from '../components/ExampleContainer';
import { useContainerSize } from '../hooks/useContainerSize';
import useEditorGrid, { Item } from './useEditorGrid';
import { Button, Divider, Radio } from 'antd';

interface Props {}

function EditorExample(props: Props) {
  const {
    columns,
    handleColumnsChange,
    list,
    handleAddList,
    checkedKeys,
    setCheckedKeys,
    selectedRowKey,
    setSelectedRowKey,
    handleRemoveList,
  } = useEditorGrid();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const [editTrigger, setEditTrigger] = React.useState<'dblclick' | 'click'>('click');

  return (
    <Wrap>
      <Buttons>
        Edit Trigger:
        <Radio.Group defaultValue={editTrigger} onChange={e => setEditTrigger(e.target.value)}>
          <Radio value='dblclick'>dblclick</Radio>
          <Radio value='click'>click</Radio>
        </Radio.Group>
        <Button size={'small'} type='primary' onClick={handleAddList}>
          Add
        </Button>
        <Button size={'small'} onClick={handleRemoveList}>
          Remove
        </Button>
        <Divider type='vertical' />
        <Button
          size={'small'}
          type='default'
          onClick={() => {
            console.log('Save', JSON.stringify(list));
          }}
        >
          Save
        </Button>
      </Buttons>

      <Container ref={containerRef}>
        <AXDataGrid<Item>
          frozenColumnIndex={3}
          width={containerWidth}
          height={containerHeight}
          data={list}
          columns={columns}
          onChangeColumns={handleColumnsChange}
          onChangeData={(ri, ci, item) => {
            console.log('onChangeData', ri, ci, item);
          }}
          rowChecked={{
            // checkedIndexes: [],
            checkedRowKeys: checkedKeys,
            onChange: (ids, keys, selectedAll) => {
              // console.log('onChange rowSelection', ids, keys, selectedAll);
              setCheckedKeys(keys);
            },
          }}
          onClick={item => {
            setSelectedRowKey(item.item.uuid);
          }}
          editable
          editTrigger={editTrigger}
          rowKey={'uuid'}
          selectedRowKey={selectedRowKey}
        />
      </Container>
    </Wrap>
  );
}

const Wrap = styled.div``;
const Container = styled(ExampleContainer)`
  .editable {
    background: rgba(255, 253, 158, 0.5);
    user-select: none;
    input,
    select {
      user-select: all;
    }
  }
`;
const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 10px 0;
  justify-content: flex-start;
  align-items: center;
`;

export default EditorExample;
