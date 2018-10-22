// @flow
import React from 'react';
import type { Node } from 'react';
import type { RequestState, RequestActions, RequestProp } from "../../index";
import Popover from 'react-popover';
import { isFunc, isObj, nonEmpty } from "../../module/helper";
import './RequestSuccess.scss';


type Props = {
  id: string,
  request: RequestState,
  actions: RequestActions,
  success?: boolean,
  children: Array<Node> | Node,
  successTooltip?: boolean,
  successReplace?: boolean,
  onCloseSuccess: (id: any) => any,
  inject?: boolean | (request: RequestProp) => Object,
  color?: string,
  className?: string

}

type State = {
  open: boolean
}

class RequestSuccess extends React.Component<Props, State> {
  props: Props;
  state: State = { open: true };

  _defaultSuccessMessage = 'Successful';


  componentWillUnmount() {
    this._closeTooltip();
  }


  /**
   * Close tooltip
   * @private
   */
  _closeTooltip = () => {
    const { id, actions, onCloseSuccess, request } = this.props;

    //handle callback
    if( this.state.open && isFunc(onCloseSuccess)){
      onCloseSuccess({ data: request, actions });
    }
    //remove request if set to autoRemove
    if(this.state.open && (request.autoRemove || request.removeOnSuccess)){
      actions.remove(id);
    } else {  actions.dirty(id) }
    this.setState({ open: false });
  };


  /**
   * Recreates children if inject is set true
   * @returns {Props.children}
   * @private
   */
  _children = () => {
    const { children, request, inject, actions } = this.props;
    const injection = { request: { data: request, actions }};

    if(React.isValidElement(children)) {
      //Map requestState to child props via inject function
      if(isFunc(inject)){
        const params = inject(injection.request);
        const paramProps = isObj(params) ? params : { request: params };
        //$FlowFixMe
        return React.cloneElement(children, paramProps);
      }
      if(inject){//$FlowFixMe
        return React.cloneElement(children, injection);
      }
    }
    return children;
  };

  /**
   * Creates tooltip content
   *
   * @returns {Tooltip}
   * @private
   */
  _createContent = () => {
    const { request } = this.props;
    let title;
    if(request.message.title) {
      title = React.isValidElement(request.message.title) ? request.message.title : (
        <div className="q-tooltip-title-success" >
          {request.message.title}
        </div>
      )
    }

    const message = request.message.body ? request.message.body : request.message;

    return (
      <div className="q-tooltip-content-success" onClick={this._closeTooltip}>
        {title}
        {message}
      </div>
    )
  };



  render() {
    const { children, successTooltip, successReplace, request, className = '' } = this.props;


    if(successReplace) {

      if(React.isValidElement(request.message)) {
        return request.message;
      }

      return (
        <div className="successContainer">
          <div>{nonEmpty(request.message) && !isObj(request.message) ? request.message : this._defaultSuccessMessage}</div>
        </div>
      );
    }

    if (successTooltip && request.message) {
      const classNames = `requestSuccessPopover ${className}`;

      return (
        <Popover
          isOpen={this.state.open}
          preferPlace="right"
          body={this._createContent()}
          className={classNames}
        >
          {this._children()}
        </Popover>
      );
    }

    return children;
  };
}

export default RequestSuccess;
