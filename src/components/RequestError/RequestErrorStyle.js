import styled  from 'styled-components';



export const ErrorContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
  color: ${p => p.color ? p.color : '#aaaaaa'}
`;

