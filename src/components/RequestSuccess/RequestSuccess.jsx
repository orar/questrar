// @flow
import React from 'react';
import type { Node } from 'react';
import './RequestSuccess.scss';
import type {RequestActions, Request, RequestProp} from "../../QuestrarTypes";
import Tooltip from 'react-tooltip';


type Props = {
  id: string,
  request: Request,
  actions: RequestActions,
  success?: boolean | string,
  children: Array<Node> | Node,
  successTooltip?: boolean,
  successReplace?: boolean,
  onCloseSuccess: (id: any) => any,
  inject?: boolean | (request: RequestProp) => Object,
}

type State = {
  visible: boolean
}

class RequestSuccess extends React.Component<Props, State> {
  props: Props;
  state: State = { visible: true };

  _defaultSuccessMessage = 'Request Successful';

  _onVisibleChange = () => {
    const { actions, id, onCloseSuccess } = this.props;
      this.setState({ visible: !this.state.visible });
      if(typeof onCloseSuccess === 'function'){
        onCloseSuccess(id)
      }
      //actions.remove(id);
  };


  _children = () => {
    const { children, request, inject, actions } = this.props;
    const injection = { request: { data: request, actions }};

    if(React.isValidElement(children)) {
      //Map requestState to child props via inject function
      if(typeof inject === 'function'){
        const params = inject(injection);
        const paramProps = params && typeof params === 'object' ? params : { request: params };
        //$FlowFixMe
        return React.cloneElement(children, paramProps);
      }
      if(inject){//$FlowFixMe
        return React.cloneElement(children, injection);
      }
    }
    return children;
  };

  _getContent = (tip: any) => {
    return (
      <div onClick={this._onVisibleChange}>
        {tip}
      </div>
    );
  };


  render() {
    const {id, success, children, successTooltip, successReplace} = this.props;

    if(successReplace) {
      return (
        <div className="requestSuccessContainer">
          <div>{success || this._defaultSuccessMessage}</div>
        </div>
      );
    }
    if (successTooltip && success) {
      return (
        <div>
          <span
            data-event-off="click"
            data-tip-disable={this.state.visible}
            data-for={id}
            data-tip={success}
          >
            {this._children()}
          </span>
          <Tooltip id={id} getContent={this._getContent} />
        </div>
      );
    }

    return children;

  };
}

export default RequestSuccess;
