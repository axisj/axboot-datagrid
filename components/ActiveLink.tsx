import { useRouter } from 'next/router';
import React from 'react';

interface Props {
  children: React.ReactNode;
  href: string;
}

function ActiveLink({ children, href }: Props) {
  const router = useRouter();
  const style = {
    marginRight: 10,
    color: router.asPath === href ? 'blue' : 'black',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  );
}

export default ActiveLink;
