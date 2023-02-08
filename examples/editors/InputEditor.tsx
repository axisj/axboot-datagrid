import * as React from 'react';
import styled from '@emotion/styled';
import { AXFDGItemRenderProps } from '../../@axframe-datagrid';
import { getCellValueByRowKey } from '../../@axframe-datagrid/utils';
import { Item } from '../useEditorGrid';
import { Input } from 'antd';

export const InputEditor = ({
  editable,
  item,
  column,
  values,
  handleSave,
  handleCancel,
}: AXFDGItemRenderProps<Item>) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentValue = React.useMemo(() => getCellValueByRowKey(column.key, item), [column, item, editable]);

  const handleSaveEdit = React.useCallback(
    (newValue: any) => {
      if (currentValue === newValue) {
        handleCancel?.();
        return;
      }
      handleSave?.(newValue);
    },
    [currentValue, handleCancel, handleSave],
  );

  const onKeyUp = React.useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
    evt => {
      switch (evt.key) {
        case 'Down': // IE/Edge에서 사용되는 값
        case 'ArrowDown':
          // "아래 화살표" 키가 눌렸을 때의 동작입니다.
          break;
        case 'Up': // IE/Edge에서 사용되는 값
        case 'ArrowUp':
          // "위 화살표" 키가 눌렸을 때의 동작입니다.
          break;
        case 'Left': // IE/Edge에서 사용되는 값
        case 'ArrowLeft':
          // "왼쪽 화살표" 키가 눌렸을 때의 동작입니다.
          break;
        case 'Right': // IE/Edge에서 사용되는 값
        case 'ArrowRight':
          // "오른쪽 화살표" 키가 눌렸을 때의 동작입니다.
          break;
        case 'Enter':
          handleSaveEdit(evt.currentTarget.value);
          break;
        case 'Esc':
        case 'Escape':
          handleCancel?.();
          break;
        default:
          return; // 키 이벤트를 처리하지 않는다면 종료합니다.
      }
    },
    [handleCancel, handleSaveEdit],
  );

  const onBlur = React.useCallback<React.FocusEventHandler<HTMLInputElement>>(
    evt => {
      handleSaveEdit(evt.target.value);
    },
    [handleSaveEdit],
  );

  if (editable) {
    return (
      <Container>
        <Input
          bordered={false}
          autoFocus
          size={'small'}
          defaultValue={currentValue}
          onKeyUp={onKeyUp}
          onBlur={onBlur}
        />
      </Container>
    );
  }
  return <>{currentValue}</>;
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;

  .ant-input {
    padding: 0;
    border-radius: 0;
    height: 100%;
    background: #fff;
    //background: #ccc;
  }
`;
