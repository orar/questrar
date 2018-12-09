// @flow
import React from 'react';
import { Request, withRequest } from 'questrar';
import { Button, Popup } from 'semantic-ui-react';
import { isObj } from '../helper';
import '../Common.scss';


type Props = {
  id: string,
  request?: Object,
}


const PopupOnButton = ({ buttonContent, onClick, request, actions  }) => {
  const loading = request.pending;
  const disabled = request.pending;

  const closePopup = () => {
    if (actions) {
      actions.remove();
    }
  };

  const trigger = (
    <Button onClick={onClick} loading={loading} disabled={disabled} content={buttonContent} />
  );

  const messageBody = request.message ? request.message.body : '';
  const messageHeader = request.message ? request.message.title : '';

  return (
    <Popup
      trigger={trigger}
      content={messageBody}
      header={messageHeader}
      on="click"
      open={request.failed}
      position="right center"
    />
  );
};


export const DeleteButton = ({ id, request }: Props) => {

  const dId = `${id}_del`; // undefined_del


  const deleteStatus = () => {
    if (request && !isObj(request.data.message)) {
      return (
        <div className="deleteStatus">
          {request.data.message}
          ...
        </div>
      );
    }
    return null;
  };


  /**
   * Maps requestState to button props
   */
  const mapRequestStateToButtonProps = (r) => {
    console.log(r);

    return {
      loading: r.data.pending,
      disabled: r.data.pending,
      request: r.data,
      actions: r.actions,
      /* eslint-disable no-undef */
      onClick: (evt: SyntheticEvent<*>) => {
        evt.preventDefault();

        const dataId = r.data.id;

        const title = 'Trash Bin Failure!';
        const body = 'Sorry, you deserve a golden Bin';


        r.actions.pending(r.data.id, 'Checking Trash Bin compatibility');
        try {
          setTimeout(() => {
            r.actions.failed(dataId, { title, body });
          }, 2000);
        } catch (e) {
          console.log(e);
        }
      },
    };
  };

  return (
    <div className="deleteButtonContainer">

      <div className="warning">
        <span className="warnBold">Warning</span>
        : This button would delete you. You will find yourself in the nearest trash bin after.
      </div>

      <div className="deleteStatusWrap">
        {deleteStatus()}
        <div>Request Failures: {request.data.failureCount}</div>
        <div>Request Successes: {request.data.successCount}</div>
      </div>

      <div className="warnButtonWrap">
        <Request
          id={dId}
          inject={mapRequestStateToButtonProps}
        >
         <PopupOnButton buttonContent="Delete Yourself" />
        </Request>
      </div>
    </div>
  );
};

const extractIds = props => `${props.id}_del`;

export default withRequest({ id: extractIds })(DeleteButton);
// export default DeleteButton;
