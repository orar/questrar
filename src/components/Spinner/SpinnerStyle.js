import styled, { keyframes } from 'styled-components';

export const circleFadeDelayFrame = keyframes`
  0%, 39%, 100% { opacity: 0; }
  40% { opacity: 1; }
`;


export const Gear = styled.div`
  margin: 2px;
  width: ${p => p.width ? `${p.width}px` : ' 40px' };
  height: ${p => p.height ? `${p.height}px` : '40px' };
  position: relative;
`;


export const Circle = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  
  &:before {
    background-color: ${p => p.color ? p.color : '#ccc'};
    content: '';
    display: block;
    margin: 0 auto;
    width: 6%;
    height: 25%;
    border-radius: 100%;
    -webkit-animation: ${circleFadeDelayFrame} 1.2s infinite ease-in-out both;
    animation: ${circleFadeDelayFrame} 1.2s infinite ease-in-out both;
  }
`;


export const Cog = styled(Circle)`
  -webkit-transform: ${p => p.rotate ? `rotate(${p.rotate}deg)` : 'rotate(120deg)'} ;
  -ms-transform: ${p => p.rotate ? `rotate(${p.rotate}deg)` : 'rotate(120deg)'} ;
  transform: ${p => p.rotate ? `rotate(${p.rotate}deg)` : 'rotate(120deg)'} ;
  
  &:before {
   -webkit-animation-delay: ${p => p.delay ? `${p.delay}s` : '-1.1s'};
   animation-delay: ${p => p.delay ? `${p.delay}s` : '-1.1s'};
  }
`;

