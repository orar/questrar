// @flow
import React from 'react';
import type { Node } from 'react';
import { SuccessContainer } from './RequestSuccessStyle';
import type { RequestState, RequestActions, RequestProp } from "../../index";
import Floater from 'react-floater';
import {isFunc, isObj } from "../../module/helper";


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
  color?: string

}

type State = {
  open: boolean
}

class RequestSuccess extends React.Component<Props, State> {
  props: Props;
  state: State = { open: true };

  _defaultSuccessMessage = 'Request Successful';


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
      onCloseSuccess(id);
    }
    //remove request if set to autoRemove
    if(this.state.open && (request.autoRemove || request.removeOnSuccess)){
      actions.remove(id);
    }
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
        const params = inject(injection);
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

    return (
      <div
        style={{width: '100%', filter: 'none'}}
        className="q-tooltip-content-success"
        onClick={this._closeTooltip}
      >
        {!!request.message.body ? request.message.body : request.message}
      </div>
    )
  };

  /**
   * Creates a tooltip title
   *
   * @returns {Tooltip}
   * @private
   */
  _createTitle = () => {
    const { request } = this.props;

    if(request.message.title) {
      return React.isValidElement(request.message.title) ? request.message.title : (
        <div className="q-tooltip-title-success" style={{width: '100%' }}>
          {request.message.title}
        </div>
      )
    }
  };

  //Success tooltip styles
  _styles = () => {
    return {
      tooltip: {
        filter: "none"
      },
      container: {
        cursor: "pointer",
        backgroundColor: "#529c4f",
        borderRadius: 5,
        color: "#fff",
        filter: "none",
        minHeight: "none",
        maxWidth: "none",
        padding: 0,
      },
      arrow: {
        color: "#529c4f",
        length: 8,
        spread: 10
      }
    };
  };


  render() {
    const { children, successTooltip, successReplace, request, color} = this.props;


    if(successReplace) {

      if(React.isValidElement(request.message)) {
        return request.message;
      }

      return (
        <SuccessContainer color={color}>
          <div>{request.message && !isObj(request.message) ? request.message : this._defaultSuccessMessage}</div>
        </SuccessContainer>
      );
    }

    if (successTooltip && request.message) {
      return (
        <Floater
          offset={0}
          open={this.state.open}
          title={this._createTitle()}
          content={this._createContent()}
          placement="auto"
          styles={this._styles()}
        >
          {this._children()}
        </Floater>
      );
    }

    return children;
  };
}

export default RequestSuccess;
