# axFrame Data Grid

[![npm version](https://badge.fury.io/js/@axframe/datagrid.svg)](https://badge.fury.io/js/@axframe/datagrid)
[![](https://img.shields.io/npm/dm/@axframe/datagrid.svg)](https://www.npmjs.com/package/@axframe/datagrid)

## Install

```bash
npm i @axframe/datagrid
```

## Development

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Styling

```typescript jsx
import '@axframe/datagrid/style.css';
```

or

Add the code below to your project.

```css
[role='axframe-datagrid'] {
  --axfdg-primary-color: #3b82f6;
  --axfdg-header-bg: #f3f4f5;
  --axfdg-header-color: #222;
  --axfdg-header-font-weight: 500;
  --axfdg-header-hover-bg: #e2e5e5;
  --axfdg-header-group-bg: #e9e9e9;
  --axfdg-footer-bg: #f3f4f5;
  --axfdg-border-color-base: #d2d5d9;
  --axfdg-border-radius: 4px;
  --axfdg-row-selector-color: #ffffff;
  --axfdg-body-bg: #ffffff;
  --axfdg-body-hover-bg: #f3f4f5;
  --axfdg-body-color: #444;

  --axfdg-scroll-size: 11px;
  --axfdg-scroll-track-bg: #f9f9f9;
  --axfdg-scroll-thumb-radius: 6px;
  --axfdg-scroll-thumb-bg: #c0c1c5;
  --axfdg-scroll-thumb-hover-bg: #a1a3a6;

  --axfdg-loading-bg: rgba(163, 163, 163, 0.1);
  --axfdg-loading-color: rgba(0, 0, 0, 0.1);
  --axfdg-loading-second-color: #767676;
}
```

## USE

```typescript jsx
import * as React from 'react';
import styled from '@emotion/styled';
import { AXFDataGrid, AXFDGColumn } from '@axframe/datagrid';

interface Props {}

interface IListItem {
  id: string;
  title: string;
  writer: string;
  createAt: string;
}

const list = Array.from(Array(1000)).map((v, i) => ({
  values: {
    id: `ID_${i}`,
    title: `title_${i}`,
    writer: `writer_${i}`,
    createAt: `2022-09-08`,
  },
}));

function BasicExample(props: Props) {
  const [columns, setColumns] = React.useState<AXFDGColumn<IListItem>[]>([
    {
      key: 'id',
      label: '아이디 IS LONG !',
      width: 100,
    },
    {
      key: 'title',
      label: '제목',
      width: 300,
      itemRender: item => {
        return `${item.writer}//${item.title}`;
      },
    },
    {
      key: 'writer',
      label: '작성자',
      width: 100,
      itemRender: item => {
        return `${item.writer}//A`;
      },
    },
    {
      key: 'createAt',
      label: '작성일A',
      width: 100,
    },
    {
      key: 'createAt',
      label: '작성일B',
      width: 100,
    },
    {
      key: 'createAt',
      label: '작성일C',
      width: 100,
    },
    {
      key: 'createAt',
      label: '작성일D',
      width: 100,
    },
    {
      key: 'createAt',
      label: '작성일E',
      width: 100,
    },
  ]);

  return (
    <Container>
      <AXFDataGrid<IListItem>
        width={600}
        height={400}
        data={list}
        columns={columns}
        onChangeColumns={(columnIndex, width, columns) => {
          console.log('onChangeColumnWidths', columnIndex, width, columns);
          setColumns(columns);
        }}
        rowSelection={{
          selectedIds: [],
          onChange: (ids, selectedAll) => {
            console.log('onChange rowSelection', ids, selectedAll);
          },
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  font-size: 13px;
`;

export default BasicExample;
```

TBD Examples
