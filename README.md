# React Frame Data Grid

[![npm version](https://badge.fury.io/js/react-frame-datagrid.svg)](https://badge.fury.io/js/react-frame-datagrid)
[![](https://img.shields.io/npm/dm/react-frame-datagrid.svg)](https://www.npmjs.com/package/react-frame-datagrid)

## Install

```bash
npm i react-frame-datagrid
```

## Development

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Styling

```typescript jsx
import 'react-frame-datagrid/style.css';
```

or

Add the code below to your project.

```css
[role="react-frame-datagrid"] {
    --rfdg-primary-color: #3B82F6;
    --rfdg-header-bg: #F3F4F5;
    --rfdg-header-hover-bg: #e2e5e5;
    --rfdg-header-group-bg: #e9e9e9;
    --rfdg-footer-bg: #F3F4F5;
    --rfdg-border-color-base: #D2D5D9;
    --rfdg-border-radius: 4px;
    --rfdg-row-selector-color: #ffffff;
    --rfdg-body-bg: #ffffff;
    --rfdg-body-hover-bg: #F3F4F5;

    --rfdg-scroll-size: 11px;
    --rfdg-scroll-track-bg: #F9F9F9;
    --rfdg-scroll-track-corner-bg: #D2D5D9;
    --rfdg-scroll-thumb-radius: 6px;
    --rfdg-scroll-thumb-bg: #c0c1c5;
    --rfdg-scroll-thumb-hover-bg: #a1a3a6;

    --rfdg-loading-bg: rgba(163, 163, 163, 0.1);
    --rfdg-loading-color: rgba(0, 0, 0, 0.1);
    --rfdg-loading-second-color: #767676;
}
```

## USE

```typescript jsx
import * as React from 'react';
import styled from '@emotion/styled';
import {RFDataGrid, RFDGColumn} from 'react-frame-datagrid';

interface Props {
}

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
  const [columns, setColumns] = React.useState<RFDGColumn<IListItem>[]>([
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
      <RFDataGrid<IListItem>
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
