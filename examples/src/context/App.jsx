// flow
import React from 'react';
import { Provider } from 'questrar';
import createStateProvider from 'questrar/store';
import ProfilePage from './ProfilePage';
import DeleteButton from './DeleteButton';
import PostPage from './PostPage';
import RequestButton from './RequestButton';

const style = {
  display: 'flex',
  justifyContent: 'center',
  flexGrow: 1,
  width: '100%',
  padding: 30,

};

const stateProvider = createStateProvider();

const App = () => (
  <div style={style} className="contextStateAppContainer">
    <Provider stateProvider={stateProvider}>
      <PostPage />
    </Provider>
  </div>
);

export default App;
