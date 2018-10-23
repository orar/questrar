// @flow
import React from 'react';
import  { Request, withRequest }  from "questrar";
import { Button } from 'semantic-ui-react';
import { isObj } from "../helper";
import './Common.scss';


type Props = {
  id: string,
  request?: Object,
}

export const DeleteButton = ({ id, request }: Props) => {
  //console.log(request);
  const dId = id + '_del';


  const deleteStatus = () => {
    //console.log(request);
    if(request && !isObj(request.data.message)) {
      return <div className="deleteStatus">{request.data.message}...</div>
    }
  };


  /**
   * Maps requestState to button props
   *
   */
  const _mapRequestStateToButtonProps = (r) => {
    console.log(r);

    return {
      loading: r.data.pending,
      disabled: r.data.pending,
      //$FlowFixMe
      onClick: (evt: SyntheticEvent<MouseEvent>) => {
        evt.preventDefault();

        const dataId = r.data.id;

        const title = "Trash Bin Failure!";
        const body ="Sorry, you deserve a golden Bin";


        r.actions.pending(r.data.id, 'Checking Trash Bin compatibility');
        try {
          setTimeout(() => {
            r.actions.success(dataId, { title, body })
          }, 2000)
        } catch(e) {
          console.log(e)
        }
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
        <Request
          id={dId}
          failTooltip
          successTooltip
          inject={_mapRequestStateToButtonProps}
          className="skinWrapper"
        >
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
