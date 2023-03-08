import * as React from 'react';
import styled from '@emotion/styled';
import { AXFDGItemRenderProps } from '../../@axframe-datagrid';
import { delay, getCellValueByRowKey } from '../../@axframe-datagrid/utils';
import { Item } from '../useEditorGrid';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';

export const DateEditor = ({
  editable,
  item,
  column,
  values,
  value,
  handleSave,
  handleCancel,
  handleMove,
}: AXFDGItemRenderProps<Item>) => {
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
    async (value: dayjs.Dayjs) => {
      await handleSaveEdit(dayjs(value).format('YYYY-MM-DD'));
      await handleCancel?.();
    },
    [handleSaveEdit, handleCancel],
  );

  if (editable) {
    const defaultValue = value ? dayjs(value) : undefined;

    return (
      <Container>
        <DatePicker
          autoFocus
          open
          size={'small'}
          bordered={false}
          defaultValue={defaultValue}
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

  .ant-picker-borderless {
    padding: 0;
    height: 100%;
  }
`;
