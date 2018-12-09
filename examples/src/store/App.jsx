// @flow
import React from 'react';
import { Provider as RequestStateProvider } from 'questrar'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { createStateProvider } from 'questrar/redux';
import createStore from './createStore';
import ProfileApp from './Profile';


const store = createStore();
const stateProvider = createStateProvider(store);


export const App = () => (
  <ReduxStoreProvider store={store}>
    <RequestStateProvider stateProvider={stateProvider}>
      <ProfileApp />
    </RequestStateProvider>
  </ReduxStoreProvider>
);


export default App;
