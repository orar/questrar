// @flow
import React from 'react';
import  Request  from "components/Request";
import { Button } from 'semantic-ui-react';
import './Common.scss';
import withRequest from "../../src/module/withRequest";
import Tooltip from 'react-tooltip';

type Props = {
  id: string,
  request?: Object,
}

export const DeleteButton = ({ id, request }: Props) => {
  //console.log(request);
  const dId = id + '_del';


  const deleteStatus = () => {
    //console.log(request);
    if(request && request.data.message) {
      return <div className="deleteStatus">{request.data.message}...</div>
    }
  };


  /**
   * Maps requestState to button props
   *
   */
  const _mapRequestStateToButtonProps = (arg) => {
    const r = arg.request;
    //console.log(r);

    return {
      loading: r.data.pending,
      disabled: r.data.pending,
      //$FlowFixMe
      onClick: (evt: SyntheticEvent<MouseEvent>) => {
        evt.preventDefault();

        // TODO: Unusual behavior: switch of context causing a failed update on another RequestState
        // Initially, `r.data.id` is what's expected. After pending update is called, id changes to another request state id
        // causing the failed update to be called on another request state instead of delete button request state
        // Hack: corrected by immutably copying the id value. Setting it to const
        const dataId = r.data.id;

        r.actions.pending(r.data.id, 'Checking Trash Bin compatibility');
        setTimeout(() => {
          r.actions.failed(dataId, "Trash Bin failure! Sorry, you deserve a golden Bin. Try again next year :)")
        }, 2000)
      }
    }
  };

  return (
    <div className="deleteButtonContainer">

      <div className="warning">
        <span className="warnBold">Warning</span>:
        This button would delete you. You will find yourself in the nearest trash bin after.
      </div>

      <div className="deleteStatusWrap">
        {deleteStatus()}
        <div>Request Failures: {request.data.failureCount}</div>
        <div>Request Successes: {request.data.successCount}</div>
      </div>

      <div className="warnButtonWrap">
        <Request id={dId} insertion="delete button --" errorTooltip inject={_mapRequestStateToButtonProps}  >
          <Button className="deleteButton">
            Delete yourself
          </Button>
        </Request>
      </div>
    </div>
  )
};



export default withRequest({ id: (props) => (props.id + '_del') })(DeleteButton);
//export default DeleteButton;