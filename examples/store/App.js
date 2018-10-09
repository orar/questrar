//flow
import React from 'react';
import { Provider as RequestStateProvider } from "../../src/index";
import { Provider as ReduxStoreProvider } from 'react-redux'
import { createStateProvider } from '../../providers/redux/index';
import createStore from './createStore';
import ProfileApp from './Profile';


const store = createStore();
const stateProvider = createStateProvider(store);


export class App extends React.Component<*> {


  render(){

    return (
      <ReduxStoreProvider store={store} >
        <RequestStateProvider stateProvider={stateProvider}>
          <ProfileApp />
        </RequestStateProvider>
      </ReduxStoreProvider>
    );
  }

}


export default App;