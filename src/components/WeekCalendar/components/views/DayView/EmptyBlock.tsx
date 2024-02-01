import React from 'react';
import styled from 'styled-components';

export const EmptyBlock = (): JSX.Element => {

  return <Root />;
}

const Root = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.4);
`;
