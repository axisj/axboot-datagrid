import * as React from 'react';
import styled from '@emotion/styled';
import { AXFDGItemRenderProps } from '../../@axframe-datagrid';
import { delay, getCellValueByRowKey } from '../../@axframe-datagrid/utils';
import { Item } from '../useEditorGrid';
import { Select } from 'antd';

export const SelectEditor = ({
  editable,
  item,
  column,
  values,
  handleSave,
  handleCancel,
  handleMove,
}: AXFDGItemRenderProps<Item>) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentValue = React.useMemo(() => getCellValueByRowKey(column.key, item), [column, item, editable]);

  const handleSaveEdit = React.useCallback(
    (newValue: any) => {
      if (currentValue === newValue) {
        return;
      }
      handleSave?.(newValue);
    },
    [currentValue, handleSave],
  );

  const onKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
    async evt => {
      switch (evt.key) {
        case 'Tab':
          evt.preventDefault();
          if (evt.shiftKey) {
            handleMove?.('prev', 'current');
          } else {
            handleMove?.('next', 'current');
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
    [handleCancel, handleMove],
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
          bordered={false}
          size={'small'}
          autoFocus
          open
          options={[
            { value: 'Y', label: '사용' },
            { value: 'N', label: '사용안함' },
          ]}
          defaultValue={currentValue}
          onSelect={onSelect}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      </Container>
    );

    // return <EditorInput ref={inputRef} defaultValue={currentValue} onKeyUp={onKeyUp} onBlur={onBlur} />;
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

  .ant-select {
    width: 100%;
    .ant-select-selector {
      padding: 0 !important;
    }
  }
`;
