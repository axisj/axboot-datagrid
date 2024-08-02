import * as React from 'react';
import styled from '@emotion/styled';
import { AXDGItemRenderProps } from '../../@axboot-datagrid';
import { Item } from '../useEditorGrid';
import { Input } from 'antd';

export const InputEditor = ({
  editable,
  item,
  column,
  values,
  value,
  handleSave,
  handleCancel,
  handleMove,
}: AXDGItemRenderProps<Item>) => {
  const handleSaveEdit = React.useCallback(
    (newValue: any, ...rest: any) => {
      if (value === newValue) {
        handleCancel?.();
        const [a, b] = rest;
        handleMove?.(a, b);
        return;
      }
      handleSave?.(newValue, ...rest);
    },
    [value, handleCancel, handleSave, handleMove],
  );

  const onKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
    evt => {
      switch (evt.key) {
        case 'Down':
        case 'ArrowDown':
          handleSaveEdit(evt.currentTarget.value, 'current', 'next');
          break;
        case 'Up':
        case 'ArrowUp':
          handleSaveEdit(evt.currentTarget.value, 'current', 'prev');
          break;
        case 'Tab':
          evt.preventDefault();
          if (evt.shiftKey) {
            handleSaveEdit(evt.currentTarget.value, 'prev', 'current');
          } else {
            handleSaveEdit(evt.currentTarget.value, 'next', 'current');
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
          variant={'borderless'}
          autoFocus
          size={'small'}
          defaultValue={value}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
      </Container>
    );
  }
  return <>{value}</>;
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
    background: transparent;
    //background: #ccc;
  }
`;
