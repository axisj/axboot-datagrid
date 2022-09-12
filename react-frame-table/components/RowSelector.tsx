import * as React from 'react';
import styled from '@emotion/styled';
import { useAppStore } from '../store';
import { css } from '@emotion/react';

interface Props {
  checked?: boolean;
  size?: number;
}

function RowSelector({ checked = false }: Props) {
  const checkboxHeight = useAppStore(s => s.checkboxHeight);
  const trHeight = useAppStore(s => s.trHeight);

  return <Container checked={checked} size={checkboxHeight} style={{ marginLeft: (trHeight - checkboxHeight) / 3 }} />;
}

const Container = styled.div<Props>`
  cursor: pointer;
  box-sizing: border-box;
  display: block;
  border-width: 1px;
  border-style: solid;
  border-color: var(--rft-border-color-base);
  border-radius: 2px;
  background-color: var(--rft-row-selector-color);
  ${({ checked, size }) => {
    return css`
      width: ${size}px;
      height: ${size}px;
    `;
  }};
`;

export default RowSelector;
