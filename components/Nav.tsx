import * as React from 'react';
import styled from '@emotion/styled';
import ActiveLink from './ActiveLink';

interface Props {}

function Nav(props: Props) {
  return (
    <Container>
      <ul>
        <li>
          <ActiveLink href={'/'}>Index</ActiveLink>
        </li>
        <li>
          <ActiveLink href={'/columnGroup'}>columnGroup</ActiveLink>
        </li>
        <li>
          <ActiveLink href={'/sort'}>Sort</ActiveLink>
        </li>
        <li>
          <ActiveLink href={'/paging'}>Paging</ActiveLink>
        </li>
      </ul>
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

export default Nav;
