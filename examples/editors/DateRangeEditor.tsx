import * as React from 'react';
import styled from '@emotion/styled';
import { AXFDGItemRenderProps } from '../../@axframe-datagrid';
import { delay, getCellValueByRowKey } from '../../@axframe-datagrid/utils';
import { Item } from '../useEditorGrid';
import { Button, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';

export const getDateRangeEditor = (rangeKeys: string[]) => {
  return function DateRangeEditor({
    editable,
    item,
    column,
    values,
    handleSave,
    handleCancel,
  }: AXFDGItemRenderProps<Item>) {
    const [key0, key1] = rangeKeys;

    const currentValue0 = React.useMemo(() => {
      return getCellValueByRowKey(key0, item);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [column, item, editable]);

    const currentValue1 = React.useMemo(() => {
      return getCellValueByRowKey(key1, item);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [column, item, editable]);

    const handleSaveEdit = React.useCallback(
      (newValue: any) => {
        // if (currentValue === newValue) {
        //   return;
        // }
        handleSave?.(newValue);
      },
      [handleSave],
    );

    const onKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
      async evt => {
        switch (evt.key) {
          case 'Down':
          case 'ArrowDown':
            // "아래 화살표" 키가 눌렸을 때의 동작입니다.
            break;
          case 'Up':
          case 'ArrowUp':
            // "위 화살표" 키가 눌렸을 때의 동작입니다.
            break;
          case 'Left':
          case 'ArrowLeft':
            // "왼쪽 화살표" 키가 눌렸을 때의 동작입니다.
            break;
          case 'Right':
          case 'ArrowRight':
            // "오른쪽 화살표" 키가 눌렸을 때의 동작입니다.
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
      [handleCancel],
    );

    const onBlur = React.useCallback<React.FocusEventHandler<HTMLInputElement>>(async evt => {
      console.log('onBlur');
      // await handleCancel?.();
    }, []);

    const onSelect = React.useCallback(
      async (value: dayjs.Dayjs) => {
        await handleSaveEdit(dayjs(value).format('YYYY-MM-DD'));
        await handleCancel?.();
      },
      [handleSaveEdit, handleCancel],
    );

    if (editable) {
      return (
        <Container>
          <DatePicker.RangePicker
            autoFocus
            open
            size={'small'}
            bordered={false}
            // defaultValue={[dayjs(currentValue0), dayjs(currentValue1)]}
            // onSelect={onSelect}
            onKeyDown={onKeyDown}
            renderExtraFooter={() => (
              <ButtonWrap>
                <Button size={'small'}>OK</Button>
              </ButtonWrap>
            )}
          />
        </Container>
      );
    }

    return (
      <>
        {currentValue0}~{currentValue1}
      </>
    );
  };
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

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;
