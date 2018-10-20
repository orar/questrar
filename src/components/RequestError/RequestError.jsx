// @flow
import React from 'react';
import type { Node } from 'react';
import { ErrorContainer } from './RequestErrorStyle';
import type { RequestActions, RequestState } from "../../index";
import Floater from 'react-floater';
import { isFunc, isObj } from "../../module/helper";


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
  color?: string
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
      onCloseError(id);
    }
    //remove request if set to autoRemove
    if(this.state.open && (request.autoRemove || request.removeOnFail)){
      actions.remove(id);
    }
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
      <div style={{width: '100%', filter: 'none'}} className="q-tooltip-content-failed" onClick={this._closeTooltip}>
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
        <div className="q-tooltip-title-failed" style={{width: '100%', marginBottom: 10}}>
          {request.message.title}
        </div>
      )
    }
  };

  //Error tooltip styles
  _styles = () => {
    return {
      tooltip: {
        filter: "none"
      },
      container: {
        cursor: "pointer",
        backgroundColor: "#aa2f23",
        borderRadius: 5,
        color: "#fff",
        filter: "none",
        minHeight: "none",
        maxWidth: "none",
        padding: 0,
      },
      arrow: {
        color: "#aa2f23",
        length: 8,
        spread: 10
      }
    };
  };

  render() {
    const { errorTooltip, request, passiveOnError, color } = this.props;

    if (errorTooltip && request.message) {

      return (
          <Floater
            title={this._createTitle()}
            open={this.state.open}
            content={this._createContent()}
            placement="auto"
            offset={0}
            styles={this._styles()}
          >
            {this._children()}
          </Floater>
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
        <ErrorContainer color={color}>
          {request.message.title}
          {request.message.body}
        </ErrorContainer>
      );
    }


    if(request.message) {
      return (
        <ErrorContainer color={color}>
          {request.message}
        </ErrorContainer>
      );
    }

    return (
      <ErrorContainer color={color}>
        <div>An error occurred. Please try again later.</div>
      </ErrorContainer>
    );

  };
}

export default RequestError;
