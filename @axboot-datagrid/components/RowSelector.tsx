import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import { css } from '@emotion/react';

interface StylesProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: number;
  itemHeight?: number;
}

interface Props extends StylesProps {
  handleChange?: (checked: boolean) => void;
}

function RowSelector({ checked = false, indeterminate, handleChange, disabled }: Props) {
  const itemHeight = useAppStore(s => s.itemHeight);
  const checkboxHeight = Math.min(15, itemHeight);

  return (
    <Container
      disabled={disabled}
      itemHeight={itemHeight}
      onClick={() => {
        if (disabled) return;
        handleChange?.(!checked);
      }}
    >
      <CheckBoxControl disabled={disabled} size={checkboxHeight} checked={checked} indeterminate={indeterminate} />
    </Container>
  );
}

const Container = styled.div<StylesProps>`
  position: relative;

  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;

  height: ${p => p.itemHeight}px;
`;

const CheckBoxControl = styled.div<StylesProps>`
  position: relative;
  transition: all 0.3s;

  cursor: pointer;
  box-sizing: border-box;
  display: block;
  border-width: 1px;
  border-style: solid;
  border-color: var(--axdg-border-color-base);
  border-radius: 2px;
  background-color: var(--axdg-row-selector-color);

  &:hover {
    border-color: var(--axdg-primary-color);
  }

  ${({ size = 0 }) => {
    return css`
      width: ${size}px;
      height: ${size}px;

      &:after {
        display: table;
        content: ' ';
        opacity: 1;
        position: absolute;
        top: 47%;
        left: 21%;
        width: ${Math.max(size - 11, 2)}px;
        height: ${Math.max(size - 9, 4)}px;
      }
    `;
  }};

  ${({ disabled, checked, indeterminate, size = 0 }) => {
    if (disabled) {
      return css`
        background-color: var(--axdg-border-color-base);
        border-color: var(--axdg-border-color-light);
        cursor: not-allowed;
      `;
    }
    if (indeterminate) {
      return css`
        &:after {
          background-color: var(--axdg-primary-color);
          width: ${size - 8}px;
          height: ${size - 8}px;
          left: 3px;
          top: 3px;
        }
      `;
    }
    if (checked) {
      return css`
        background-color: var(--axdg-primary-color);
        border-color: var(--axdg-primary-color);

        &:after {
          border: 2px solid #fff;
          border-top: 0;
          border-left: 0;
          transform: rotate(45deg) scale(1) translate(-50%, -50%);
        }
      `;
    }
    return css``;
  }};
`;

export default RowSelector;
