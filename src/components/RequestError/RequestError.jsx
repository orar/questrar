// @flow
import React from 'react';
import type { Node } from 'react';
import type { RequestActions, RequestState } from "../../index";
import { isFunc, isObj } from "../../module/helper";
import './RequestError.scss';
import Popover from 'react-popover';

type Props = {
  id: string,
  request: RequestState,
  actions: RequestActions,
  failure?: boolean | string,
  children: Array<Node> | Node,
  errorTooltip?: boolean,
  onCloseError?: (data: any) => any,
  passiveOnError: boolean,
  inject?: boolean | (request: RequestState) => Object,
  color?: string,
  className?: string
}

type State = {
  open: boolean
}


/**
 * Error state automatically replaces children with default error message or custom.
 * Implementation of noErrorReplace turns this feature off
 * TODO: noErrorReplace: Render children even if error
 */
class RequestError extends React.Component<Props, State> {
  props: Props;
  state: State = { open: true };

  //close tooltip on unmount
  componentWillUnmount() {
    this._closeTooltip();
  }

  /**
   * Close tooltip and call backs
   * @private
   */
  _closeTooltip = () => {
    const { id, actions, onCloseError, request } = this.props;

    //handle callback
    if(this.state.open && isFunc(onCloseError)){
      onCloseError({ data: request, actions });
    }
    //remove request if set to autoRemove
    if(this.state.open && (request.autoRemove || request.removeOnFail)){
      actions.remove(id);
    } else {  actions.dirty(id) }
    this.setState({ open: false });
  };

  /**
   * Recreates children if needed for request props injection
   * @returns {Props.children}
   * @private
   */
  _children = () => {
    const { children, request, inject, actions } = this.props;
    const injection = { request: { data: request, actions }};

    if(React.isValidElement(children)) {
      //Transform requestState to child props via inject function
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
        <div className="q-tooltip-title-failed" >
          {request.message.title}
        </div>
      )
    }

    const message = request.message.body ? request.message.body : request.message;

    return (
      <div className="q-tooltip-content-failed" onClick={this._closeTooltip}>
        {title}
        {message}
      </div>
    )
  };

  render() {
    const { errorTooltip, request, passiveOnError, className = '' } = this.props;

    if (errorTooltip && request.message) {
      const classNames = `requestFailurePopover ${className}`;

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

    if(passiveOnError){
      return this._children();
    }

    if(React.isValidElement(request.message)) {
      return request.message;
    }

    if(isObj(request.message)) {
      return (
        <div className="failureContainer">
          {request.message.title}
          {request.message.body}
        </div>
      );
    }

    if(request.message) {
      return (
        <div className="failureContainer">
          {request.message}
        </div>
      );
    }

    return (
      <div className="failureContainer" >
        <div>An error occurred. Please try again later.</div>
      </div>
    );

  };
}

export default RequestError;
