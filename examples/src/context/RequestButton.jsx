// @flow
import React, { Component } from 'react';
import { Button, Icon, ButtonGroup } from 'semantic-ui-react';
import { Request } from 'questrar';
import '../Common.scss';


const randomInt = () => Math.floor(Math.random() * 100);

const RequestPane = ({}) => {

  return (
    <div>
      <div>
        <ButtonGroup>
          <Button content="Fail" />
          <Button content="Pend" />
          <Button content="Success" />
        </ButtonGroup>
      </div>
      <div>

      </div>
    </div>
  )
}

/**
*
* @author Orar
* @date   11/21/18, 12:09 PM
*/
class RequestButton extends Component<Props> {
  props: Props;


  componentDidMount() {

  }


  render() {
    return (
      <div className="requestStateContainer">
        <div className="pending">
          <div className="stateHeader">Pending onMount</div>
          <div className="pendingButtonWrap">
            <div className="pendButton">
              <Request id="id_1" pendOnMount={randomInt() % 5 < 3}>
                <Button>Replaced Button</Button>
              </Request>
            </div>
            <div className="pendButton">
              <Request id="id_2" pendOnMount={<Icon loading name="circle notched" />}>
                <Button>Injected prop button</Button>
              </Request>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default RequestButton;
