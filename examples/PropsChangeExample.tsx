import * as React from 'react';
import styled from '@emotion/styled';
import { RFTable, RFTableColumn, RFTableSortParam } from '../react-frame-table';
import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, Row, Select, Switch } from 'antd';

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

function PropsChangeExample(props: Props) {
  const [loading, setLoading] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);
  const [width, setWidth] = React.useState(600);
  const [height, setHeight] = React.useState(300);
  const [headerHeight, setHeaderHeight] = React.useState(35);
  const [footerHeight, setFooterHeight] = React.useState(30);
  const [itemHeight, setItemHeight] = React.useState(14);
  const [itemPadding, setItemPadding] = React.useState(7);
  const [frozenColumnIndex, setFrozenColumnIndex] = React.useState(0);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [sortParams, setSortParams] = React.useState<RFTableSortParam[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  const [columns, setColumns] = React.useState<RFTableColumn<IListItem>[]>([
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
      label: '작성일',
      width: 100,
    },
  ]);

  return (
    <Container>
      <RFTable<IListItem>
        width={width}
        height={height}
        headerHeight={headerHeight}
        footerHeight={footerHeight}
        itemHeight={itemHeight}
        itemPadding={itemPadding}
        frozenColumnIndex={frozenColumnIndex}
        data={list}
        columns={columns}
        onChangeColumns={(columnIndex, width, columns) => {
          console.log('onChangeColumnWidths', columnIndex, width, columns);
          setColumns(columns);
        }}
        rowSelection={{
          selectedIds,
          onChange: (ids, selectedAll) => {
            console.log('onChange rowSelection', ids, selectedAll);
          },
        }}
        page={{
          currentPage: currentPage,
          pageSize: 50,
          totalPages: 10,
          totalElements: 498,
          loading: false,
          onChange: (pageNo, pageSize) => {
            console.log(pageNo, pageSize);
            setCurrentPage(pageNo);
          },
          displayPaginationLength: 5,
        }}
        sort={{
          sortParams,
          onChange: sortParams => {
            console.log('onChange: sortParams', sortParams);
          },
        }}
        loading={loading}
        spinning={spinning}
      />

      <Divider />

      <Form
        layout={'vertical'}
        initialValues={{
          width,
          height,
          headerHeight,
          footerHeight,
          itemHeight,
          itemPadding,
          frozenColumnIndex,
          selectedIds,
          sortParams,
          currentPage,
        }}
      >
        <Row gutter={20}>
          <Col span={6}>
            <Form.Item name={'loading'} label={'Loading'} valuePropName={'checked'}>
              <Switch onChange={checked => setLoading(checked)} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={'spinning'} label={'Spinning'} valuePropName={'checked'}>
              <Switch onChange={checked => setSpinning(checked)} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={'width'} label={'Width'}>
              <InputNumber
                min={100}
                onChange={width => {
                  setWidth(Number(width));
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={'height'} label={'Height'}>
              <InputNumber
                min={100}
                onChange={height => {
                  setHeight(Number(height));
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={'headerHeight'} label={'Header Height'}>
              <InputNumber
                min={22}
                onChange={headerHeight => {
                  setHeaderHeight(Number(headerHeight));
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={'footerHeight'} label={'Footer Height'}>
              <InputNumber
                min={22}
                onChange={footerHeight => {
                  setFooterHeight(Number(footerHeight));
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={'itemHeight'} label={'Item Height'}>
              <InputNumber
                min={1}
                onChange={itemHeight => {
                  setItemHeight(Number(itemHeight));
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={'itemPadding'} label={'Item Padding'}>
              <InputNumber
                min={1}
                onChange={itemPadding => {
                  setItemPadding(Number(itemPadding));
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={6}>
            <Form.Item name={'frozenColumnIndex'} label={'Frozen Column Index'}>
              <Select
                onChange={value => setFrozenColumnIndex(value)}
                options={columns.map((c, i) => ({ value: i, text: i }))}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={'selectedIds'} label={'Selected ID'}>
              <Checkbox.Group
                options={Array.from({ length: 30 }).map((_, i) => ({ label: i, value: i }))}
                onChange={checkedValue => {
                  setSelectedIds(checkedValue as number[]);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={'sortParams'} label={'SortParams'}>
              <Checkbox.Group
                options={[
                  { label: 'id desc', value: `{ "key": "id", "orderBy": "desc" }` },
                  { label: 'title asc', value: `{ "key": "title", "orderBy": "asc" }` },
                  { label: 'writer desc', value: `{ "key": "writer", "orderBy": "desc" }` },
                  { label: 'createAt asc', value: `{ "key": "createAt", "orderBy": "asc" }` },
                ]}
                onChange={checkedValue => {
                  setSortParams(
                    checkedValue.map(value => {
                      console.log(value);
                      return JSON.parse(`${value}`);
                    }),
                  );
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  font-size: 13px;
`;

export default PropsChangeExample;
