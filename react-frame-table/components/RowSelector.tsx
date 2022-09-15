import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import { css } from '@emotion/react';

interface Props {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: number;
  handleChange?: (checked: boolean) => void;
}

function RowSelector({ checked = false, indeterminate, handleChange }: Props) {
  const checkboxHeight = useAppStore(s => s.itemHeight);
  return (
    <Container
      checked={checked}
      indeterminate={indeterminate}
      size={checkboxHeight}
      onClick={() => handleChange?.(!checked)}
    />
  );
}

const Container = styled.div<Props>`
  position: relative;
  transition: all 0.3s;
  cursor: pointer;
  box-sizing: border-box;
  display: block;
  border-width: 1px;
  border-style: solid;
  border-color: var(--rft-border-color-base);
  border-radius: 2px;
  background-color: var(--rft-row-selector-color);

  &:hover {
    border-color: var(--rft-primary-color);
  }

  ${({ size = 0 }) => {
    return css`
      width: ${size}px;
      height: ${size}px;

      &:after {
        position: absolute;
        top: 50%;
        left: ${97 - (11 / size) * 100}%;
        width: ${size - 11}px;
        height: ${size - 8}px;
      }
    `;
  }};

  ${({ checked, indeterminate, size = 0 }) => {
    if (indeterminate) {
      return css`
        &:after {
          display: table;
          opacity: 1;
          content: ' ';
          background-color: var(--rft-primary-color);
          width: ${size - 8}px;
          height: ${size - 8}px;
          left: 3px;
          top: 3px;
        }
      `;
    }
    if (checked) {
      return css`
        background-color: var(--rft-primary-color);
        border-color: var(--rft-primary-color);

        &:after {
          display: table;
          border: 2px solid #fff;
          border-top: 0;
          border-left: 0;
          transform: rotate(45deg) scale(1) translate(-50%, -50%);
          opacity: 1;
          transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
          content: ' ';
        }
      `;
    }
    return css``;
  }};
`;

export default RowSelector;