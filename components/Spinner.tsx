import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import * as React from 'react';

interface ISPinIconProps {
  size?: number;
  strokeWidth?: number;
}

export const Spinner: React.FC<ISPinIconProps> = ({ size = 20, strokeWidth = 5 }) => (
  <Svg className='spin-icon' viewBox='0 0 50 50' style={{ width: size, height: size }}>
    <circle className='path' cx='25' cy='25' r='20' fill='none' strokeWidth={strokeWidth} />
  </Svg>
);

const AniSpinIconRotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;
const AniSpinIconDash = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`;

const Svg = styled.svg`
  animation: ${AniSpinIconRotate} 2s linear infinite;
  z-index: 2;
  width: 20px;
  height: 20px;

  .path {
    stroke: #000;
    stroke-linecap: round;
    animation: ${AniSpinIconDash} 1.5s ease-in-out infinite;
  }
`;
