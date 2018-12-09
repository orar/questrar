// @flow
import React from 'react';
import { Provider as RequestStateProvider } from 'questrar';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { createStateProvider } from 'questrar/redux';
import createStore from './createStore';
import TodoApp from './TodoRequest';


const store = createStore();
const stateProvider = createStateProvider(store);


export const App = () => (
  <ReduxStoreProvider store={store}>
    <RequestStateProvider stateProvider={stateProvider}>
      <TodoApp />
    </RequestStateProvider>
  </ReduxStoreProvider>
);
export default App;
