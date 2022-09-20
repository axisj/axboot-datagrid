import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { mouseEventSubscribe } from '../utils';
import { useAppStore } from '../store';

interface StyledProps {
  hideHandle?: boolean;
}

interface Props extends StyledProps {
  container: React.RefObject<HTMLDivElement>;
  columnIndex: number;
}

function ColResizer({ container, columnIndex, hideHandle }: Props) {
  const setColumnWidth = useAppStore(s => s.setColumnWidth);

  const onMouseDownResizerHandle = React.useCallback(
    (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, columnIndex: number) => {
      evt.preventDefault();
      evt.stopPropagation();

      const columnNode = container.current?.querySelector(`[data-column-index="${columnIndex}"]`);
      const columnSX = columnNode?.getBoundingClientRect().left ?? 0;

      mouseEventSubscribe(
        mousePosition => {
          const mX = mousePosition.clientX + 4;
          const width = columnSX + 50 < mX ? mX - columnSX : 50;
          setColumnWidth(columnIndex, width);
        },
        () => {
          setColumnWidth(columnIndex);
        },
      );
    },
    [container, setColumnWidth],
  );

  const onMouseDoubleClick = React.useCallback(
    async (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, columnIndex: number) => {
      evt.preventDefault();
      evt.stopPropagation();
      //
      // const theadHTML = containerRef.current?.querySelector('thead')?.innerHTML;
      // const tbodyHTML = scrollContainer?.querySelector('tbody')?.innerHTML;
      // const targetDiv = document.createElement('div');
      // targetDiv.className = 'qptable-mirror';
      //
      // targetDiv.innerHTML = `<table><thead>${theadHTML}</thead><tbody>${tbodyHTML}</tbody></table>`;
      // const bodyTarget = document.getElementById('root') ?? document.body;
      // bodyTarget.append(targetDiv);
      //
      // await delay(30);
      //
      // const targetTd = targetDiv.querySelector(`tr:first-of-type td[data-column-index="${columnIndex}"]`);
      //
      // if (targetTd) {
      //   onChangeColumnWidth(columnIndex, targetTd.getBoundingClientRect().width);
      //   onChangeColumnWidth(columnIndex);
      // }
      // targetDiv.remove();
    },
    [],
  );

  return (
    <Container
      hideHandle={hideHandle}
      onMouseDown={evt => onMouseDownResizerHandle(evt, columnIndex)}
      onDoubleClick={() => {}}
    />
  );
}

const Container = styled.div<StyledProps>`
  position: absolute;
  right: 0;
  top: 0;
  width: 7px;
  height: 100%;
  cursor: col-resize;

  ${({ hideHandle = false }) => {
    if (hideHandle) {
      return css``;
    }
    return css`
      &:after {
        position: absolute;
        top: 50%;
        right: 3px;
        content: '';
        display: block;
        width: 1px;
        height: 0.8em;
        transform: translateY(-50%);
        background: var(--rft-border-color-base);
      }

      &:hover {
        &:after {
          background: var(--rft-primary-color);
        }
      }
    `;
  }}
`;

export default ColResizer;
