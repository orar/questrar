// flow
import React from 'react';
import { Provider as RequestStateProvider } from 'questrar';
import ProfilePage from './ProfilePage';

const style = {
  display: 'flex',
  justifyContent: 'center',
  flexGrow: 1,
  width: '100%',
  padding: 30,

};

const App = () => (
  <div style={style} className="contextStateAppContainer">
    <RequestStateProvider>
      <ProfilePage />
    </RequestStateProvider>
  </div>
);

export default App;
