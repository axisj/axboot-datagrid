import styled from '@emotion/styled';
import React from 'react';

interface ContainerProps {
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return <SContainer>{children}</SContainer>;
};

const SContainer = styled.div``;
