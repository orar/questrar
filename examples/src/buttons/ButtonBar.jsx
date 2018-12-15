// @flow
import React from 'react';
import { Button, Icon, ButtonGroup } from 'semantic-ui-react';
import type { RequestProp } from '../../../src';
import './Buttons.scss';


type Props = {
  position: number,
  request?: RequestProp,
}

const ButtonBar = ({ request, position }: Props) => {
  if (!request) return null;

  const id = request.data.id;
  const { data } = request;
  // console.log(request)

  return (
    <div className="buttonContainer">
      <span className="position">{position}</span>
      <div className="buttons-left">
        <div className="topLeft">
          <span>Success: {data.successCount}</span>
          <span>Failure: {data.failureCount}</span>
        </div>
        <div className="bottomLeft">
          {data.success && <Icon style={{ color: 'green'}} name="checkmark" />}
          {data.failed && <Icon style={{ color: 'red'}} name="close" />}
          {data.pending && <Icon style={{ color: 'yellow'}} loading name="circle notch" />}
        </div>
      </div>
      <div className="buttons-group-right">
        <ButtonGroup basic size="mini">
          <Button onClick={() => request.actions.failed(id)} basic>Fail</Button>
          <Button onClick={() => request.actions.pending(id)} basic>Pend</Button>
          <Button onClick={() => request.actions.success(id)} basic>Success</Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default ButtonBar;
