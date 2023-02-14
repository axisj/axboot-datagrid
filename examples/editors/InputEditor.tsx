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
  handleMove,
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

  const onKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
    evt => {
      switch (evt.key) {
        case 'Down':
        case 'ArrowDown':
          handleMove?.('current', 'next');
          break;
        case 'Up':
        case 'ArrowUp':
          handleMove?.('current', 'prev');
          break;
        case 'Tab':
          evt.preventDefault();
          if (evt.shiftKey) {
            handleMove?.('prev', 'current');
          } else {
            handleMove?.('next', 'current');
          }
          break;
        case 'Enter':
          handleSaveEdit(evt.currentTarget.value);
          break;
        case 'Esc':
        case 'Escape':
          handleCancel?.();
          break;
        default:
          return;
      }
    },
    [handleCancel, handleMove, handleSaveEdit],
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
          onKeyDown={onKeyDown}
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
