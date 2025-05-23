# @axboot/datagrid

DataGrid, DataSheet for React

[![NPM version](https://img.shields.io/npm/v/@axboot/datagrid.svg?style=flat)](https://npmjs.org/package/@axboot/datagrid)
[![NPM downloads](http://img.shields.io/npm/dm/@axboot/datagrid.svg?style=flat)](https://npmjs.org/package/@axboot/datagrid)

## Install

```bash
npm i @axboot/datagrid
```

## Development

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Styling

```typescript jsx
import '@axboot/datagrid/style.css';
```

or

Add the code below to your project.

```css
[role='ax-datagrid'] {
    --axdg-primary-color: #3b82f6;
    --axdg-header-bg: #f3f4f5;
    --axdg-header-color: #222;
    --axdg-header-font-weight: 500;
    --axdg-header-hover-bg: #e2e5e5;
    --axdg-header-group-bg: #e9e9e9;
    --axdg-footer-bg: #f3f4f5;
    --axdg-summary-bg: #eaeef6;
    --axdg-border-color-base: #d2d5d9;
    --axdg-border-color-light: #d2d5d9;
    --axdg-border-radius: 4px;
    --axdg-row-selector-color: #ffffff;
    --axdg-body-bg: #ffffff;
    --axdg-body-odd-bg: #f8f8f8;
    --axdg-body-hover-bg: #f3f4f5;
    --axdg-body-hover-odd-bg: #eeeeee;
    --axdg-body-active-bg: #e6f6ff;
    --axdg-body-color: #444;

    --axdg-scroll-size: 11px;
    --axdg-scroll-track-bg: #f9f9f9;
    --axdg-scroll-thumb-radius: 6px;
    --axdg-scroll-thumb-bg: #c0c1c5;
    --axdg-scroll-thumb-hover-bg: #a1a3a6;

    --axdg-loading-bg: rgba(163, 163, 163, 0.1);
    --axdg-loading-color: rgba(0, 0, 0, 0.1);
    --axdg-loading-second-color: #767676;

    --axdg-page-number-active-border-radius: 4px;
}

```

## USE

- codesandbox DEMO : https://codesandbox.io/p/devbox/basic-example-5ch6kt?embed=1&file=%2Fsrc%2FApp.tsx

```typescript jsx
import * as React from 'react';
import styled from '@emotion/styled';
import { AXDataGrid, AXDGColumn } from '@axboot/datagrid';

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
  const [columns, setColumns] = React.useState<AXDGColumn<IListItem>[]>([
    {
      key: 'id',
      label: '아이디 IS LONG !',
      width: 100,
    },
    {
      key: 'title',
      label: '제목',
      width: 300,
      itemRender: ({ value }) => {
        return (
          <>
            {value.writer} / {value.title}
          </>
        );
      },
    },
    {
      key: 'writer',
      label: '작성자',
      width: 100,
      itemRender: ({ value }) => {
        return <>{value.writer} / A</>;
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
      <AXDataGrid<IListItem>
        width={600}
        height={400}
        data={list}
        columns={columns}
        onChangeColumns={(columnIndex, { width, columns, columnsGroup }) => {
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

## Update Note

### v1.5
- rowChecked 속성 추가 (rowChecked > isRadio, rowChecked > disabled) 
```typescript
<AXDataGrid<IListItem>
  width={containerWidth}
  height={containerHeight}
  headerHeight={35}
  data={sortedList}
  columns={columns}
  onChangeColumns={(columnIndex, { width, columns }) => {
    console.log('onChangeColumnWidths', columnIndex, width, columns);
    setColumns(columns);
  }}
  rowChecked={{
    disabled: (ri, item) => ri === 0,
    isRadio: true,
    checkedRowKeys: checkedKeys,
    onChange: (ids, keys, selectedAll) => {
      console.log('onChange rowSelection', ids, keys, selectedAll);
      setCheckedKeys(keys);
    },
  }}
  sort={{
    sortParams,
    onChange: sortParams => {
      console.log('onChange: sortParams', sortParams);
      setSortParams(sortParams);
    },
  }}
  showLineNumber
  rowKey={'nation'}
/>
```

### V1.4
- columnsGroup 타입변경
기존 columnsIndex: []에서 start, end 지정 형태로 변경되었습니다.
```typescript jsx
[{ label: '묶음', groupStartIndex: 2, groupEndIndex: 4, align: 'center' }]
```
- onChangeColumns 속성 변경
```typescript jsx
// onChangeColumns Type 
onChangeColumns?: (
  columnIndex: number | null,
  info: {
    width?: number;
    columns: AXDGColumn<T>[];
    columnsGroup?: AXDGColumnGroup[];
  },
) => void;

// onChangeColumns에서 변경된 컬럼과 컬럼 그룹을 받을 수 있습니다
<AXDataGrid
  /*...*/
  onChangeColumns={(columnIndex, { columns, columnsGroup }) => {
    console.log('onChangeColumnWidths', columnIndex, columns, columnsGroup);
    setColumns(columns);
    setColumnsGroup(columnsGroup);
  }}
/>
```

