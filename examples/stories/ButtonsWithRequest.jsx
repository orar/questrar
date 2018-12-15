// @flow
import React from 'react';
import { Provider as RequestStateProvider } from 'questrar';
import createStateProvider from 'questrar/store';
import ButtonsWithRequest from '../src/buttons/ButtonsWithRequest';


const stateProvider = createStateProvider();

export const App = () => (
  <RequestStateProvider stateProvider={stateProvider}>
    <ButtonsWithRequest />
  </RequestStateProvider>
);
export default App;
