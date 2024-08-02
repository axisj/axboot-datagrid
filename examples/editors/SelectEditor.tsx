import * as React from 'react';
import styled from '@emotion/styled';
import { AXDGItemRenderProps } from '../../@axboot-datagrid';
import { Item } from '../useEditorGrid';
import { Select } from 'antd';

export const SelectEditor = ({
  editable,
  item,
  column,
  values,
  value,
  handleSave,
  handleCancel,
  handleMove,
}: AXDGItemRenderProps<Item>) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    async evt => {
      switch (evt.key) {
        case 'Tab':
          evt.preventDefault();
          if (evt.shiftKey) {
            handleSaveEdit(evt.currentTarget.value, 'prev', 'current');
          } else {
            handleSaveEdit(evt.currentTarget.value, 'next', 'current');
          }
          break;
        case 'Enter':
          break;
        case 'Esc':
        case 'Escape':
          await handleCancel?.();
          break;
        default:
          return; // 키 이벤트를 처리하지 않는다면 종료합니다.
      }
    },
    [handleCancel, handleSaveEdit],
  );

  const onBlur = React.useCallback<React.FocusEventHandler<HTMLInputElement>>(
    async evt => {
      await handleCancel?.();
    },
    [handleCancel],
  );

  const onSelect = React.useCallback(
    async (value: any, option: any) => {
      await handleSaveEdit(value);
      await handleCancel?.();
    },
    [handleSaveEdit, handleCancel],
  );

  if (editable) {
    return (
      <Container>
        <Select
          variant={'borderless'}
          size={'small'}
          autoFocus
          open
          options={[
            { value: 'Y', label: '사용' },
            { value: 'N', label: '사용안함' },
          ]}
          defaultValue={value}
          onSelect={onSelect}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      </Container>
    );

    // return <EditorInput ref={inputRef} defaultValue={currentValue} onKeyUp={onKeyUp} onBlur={onBlur} />;
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

  .ant-select {
    width: 100%;
    .ant-select-selector {
      padding: 0 !important;
    }
  }
`;
