import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { delay, mouseEventSubscribe } from "../utils";
import { useAppStore } from "../store";

interface StyledProps {
  hideHandle?: boolean;
  bordered?: boolean;
}

interface Props extends StyledProps {
  container: React.RefObject<HTMLDivElement>;
  columnIndex: number;
}

function ColResizer({ container, columnIndex, hideHandle, bordered }: Props) {
  const setColumnWidth = useAppStore(s => s.setColumnWidth);
  const setColumnResizing = useAppStore(s => s.setColumnResizing);
  const columnsGroup = useAppStore(s => s.columnsGroup);

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
          setColumnResizing(true);
          setColumnWidth(columnIndex, width);
        },
        () => {
          setColumnResizing(false);
          setColumnWidth(columnIndex);
        }
      );
    },
    [container, setColumnResizing, setColumnWidth]
  );

  const onMouseDoubleClick = React.useCallback(
    async (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, columnIndex: number) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (container.current) {
        const headFrozenHTML = container.current.querySelector("[role=\"rfdg-head-frozen\"]")?.innerHTML;
        const headHTML = container.current.querySelector("[role=\"rfdg-head\"]")?.innerHTML;
        const bodyFrozenHTML = container.current.querySelector("[role=\"rfdg-body-frozen\"]")?.innerHTML;
        const bodyHTML = container.current.querySelector("[role=\"rfdg-body\"]")?.innerHTML;
        const targetDiv = document.createElement("div");
        targetDiv.style.position = "fixed";
        targetDiv.style.top = "-9999px";

        targetDiv.innerHTML = `<table><thead>${headFrozenHTML}</thead><tbody>${bodyFrozenHTML}</tbody></table>
<table><thead>${headHTML}</thead><tbody>${bodyHTML}</tbody></table>`;
        const bodyTarget = document.getElementById("root") ?? document.body;
        bodyTarget.append(targetDiv);

        await delay(30);

        const targetTd = targetDiv.querySelector(`tr:last-of-type td[data-column-index="${columnIndex}"]`);

        if (targetTd) {
          setColumnWidth(columnIndex, targetTd.getBoundingClientRect().width);
          setColumnWidth(columnIndex);
        }
        targetDiv.remove();
      }
    },
    [container, setColumnWidth]
  );

  return (
    <Container
      bordered={bordered}
      hideHandle={hideHandle}
      onMouseDown={evt => onMouseDownResizerHandle(evt, columnIndex)}
      onDoubleClick={evt => onMouseDoubleClick(evt, columnIndex)}
      onClick={evt => evt.stopPropagation()}
    />
  );
}

const Container = styled.div<StyledProps>`
  position: absolute;
  right: -7px;
  top: 0;
  width: 14px;
  height: 100%;
  cursor: col-resize;
  z-index: 2;

  ${({ hideHandle = false, bordered }) => {
    if (hideHandle) {
      return css``;
    }
    return css`
      &:after {
        position: absolute;
        top: 50%;
        right: 7px;
        content: '';
        display: block;
        width: 1px;
        height: ${bordered ? "100%" : "1em"};
        transform: translateY(-50%);
        background: var(--axfdg-border-color-base);
      }

      &:hover {
        &:after {
          background: var(--axfdg-primary-color);
        }
      }
    `;
  }}
`;

export default ColResizer;
