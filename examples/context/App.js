//flow
import React from 'react';
import { Provider as RequestStateProvider } from "src/index";
import ProfilePage from './ProfilePage';
//import 'semantic-ui-css/semantic.css';

type Props = {

}

const style = {
  display: 'flex',
  justifyContent: 'center',
  flexGrow: 1,
  width: '100%',
  padding: 30

};

export class App extends React.Component<Props> {
  props: Props;


  render(){

    return (
      <div style={style} className="contextStateAppContainer">
        <RequestStateProvider >
          <ProfilePage/>
        </RequestStateProvider>
      </div>
    );
  }

}

export default App;