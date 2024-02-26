import * as React from 'react';
import styled from '@emotion/styled';
import { AXFDGItemRenderProps } from '../../@axframe-datagrid';
import { Item } from '../useEditorGrid';
import { DatePicker } from 'antd';
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

  const onKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLElement>>(
    evt => {
      const input = evt.currentTarget as HTMLInputElement;

      switch (evt.key) {
        case 'Down':
        case 'ArrowDown':
          handleSaveEdit(input.value, 'current', 'next');
          break;
        case 'Up':
        case 'ArrowUp':
          handleSaveEdit(input.value, 'current', 'prev');
          break;
        case 'Tab':
          evt.preventDefault();
          if (evt.shiftKey) {
            handleSaveEdit(input.value, 'prev', 'current');
          } else {
            handleSaveEdit(input.value, 'next', 'current');
          }
          break;
        case 'Enter':
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

  const onSelect = React.useCallback(
    (value: dayjs.Dayjs) => {
      console.log('onSelect', value);
      handleSaveEdit(dayjs(value).format('YYYY-MM-DD'));
    },
    [handleSaveEdit],
  );

  if (editable) {
    const defaultValue = value ? dayjs(value) : undefined;

    return (
      <Container>
        <DatePicker
          autoFocus
          open
          size={'small'}
          variant={'borderless'}
          defaultValue={defaultValue}
          onChange={onSelect}
          onOpenChange={open => {
            if (!open) handleCancel?.();
          }}
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
