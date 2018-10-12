//flow
import React from 'react';
import { Provider as RequestStateProvider } from "questrar";
import ProfilePage from './ProfilePage';

type Props = {

}

const style = {
  display: 'flex',
  justifyContent: 'center',
  flexGrow: 1,
  width: '100%',
  padding: 30

};

const App = () => {

    return (
      <div style={style} className="contextStateAppContainer">
        <RequestStateProvider >
          <ProfilePage/>
        </RequestStateProvider>
      </div>
    );
};

export default App;