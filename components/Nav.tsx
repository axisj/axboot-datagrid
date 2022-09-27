import * as React from 'react';
import styled from '@emotion/styled';
import { Tabs } from 'antd';
import { useRouter } from 'next/router';
import pkg from '../package.json';
import { GithubFilled } from '@ant-design/icons';

interface Props {}

function Nav(props: Props) {
  const router = useRouter();

  return (
    <Container>
      <Header>
        <h1>react-frame-datagrid</h1>
        <Version>{pkg.version}</Version>

        <GithubFilled
          style={{ fontSize: 20 }}
          onClick={() => window.open('https://github.com/thomasjang/react-frame-datagrid')}
        />
      </Header>
      <Tabs
        animated={false}
        defaultActiveKey={router.asPath}
        items={[
          { label: `Index`, key: '/' },
          { label: `ColumnGroup`, key: '/columnGroup' },
          { label: `Sort`, key: '/sort' },
          { label: `Paging`, key: '/paging' },
          { label: `Loading`, key: '/loading' },
          { label: `Props Change`, key: '/propsChange' },
        ]}
        onTabClick={async activeKey => {
          await router.push(activeKey);
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  ul {
    padding-left: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;

    li {
      list-style: none;
    }

    a {
      &:hover {
        color: #3b82f6;
      }
    }
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  h1 {
    margin: 0;
  }
`;

const Version = styled.div`
  padding: 1px 5px;
  background-color: #000;
  color: #fff;
  border-radius: 4px;
`;

export default Nav;
