// @flow
import React from 'react';
import { Provider as RequestStateProvider } from 'questrar';
import createStateProvider from 'questrar/store';
import ButtonsWithRequests from '../src/buttons/ButtonsWithRequests';


const stateProvider = createStateProvider();

export const App = () => (
  <RequestStateProvider stateProvider={stateProvider}>
    <ButtonsWithRequests />
  </RequestStateProvider>
);
export default App;
