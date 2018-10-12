import styled  from 'styled-components';



export const SuccessContainer = styled.div`
    width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
  color: ${p => p.color ? p.color : '#aaaaaa'};
`;

