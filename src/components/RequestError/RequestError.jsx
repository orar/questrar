// @flow
import React from 'react';
import type { Node } from 'react';
import './RequestError.scss';
import type { RequestActions, RequestState} from "../../index";
import Floater from 'react-floater';
import {isFunc} from "../../module/helper";


type Props = {
  id: string,
  request: RequestState,
  actions: RequestActions,
  failure?: boolean | string,
  children: Array<Node> | Node,
  errorTooltip?: boolean,
  onCloseError?: (data: any) => any,
  passiveOnError: boolean,
  inject?: boolean | (request: Request) => Object,

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
   * Close tooltip
   * @private
   */
  _closeTooltip = () => {
    const { id, actions, onCloseError, request } = this.props;

    //handle callback
    if( this.state.open && isFunc(onCloseError)){
      onCloseError(id);
    }
    //remove request if set to autoRemove
    if(this.state.open && (request.autoRemove || request.removeOnFail)){
      actions.remove(id);
    }
    this.setState({ open: false });
  };



  _children = () => {
    const { children, request, inject, actions } = this.props;
    const injection = { request: { data: request, actions }};

    if(React.isValidElement(children)) {
      //Transform requestState to child props via inject function
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


  /**
   * Creates a failure reporting tooltip around child component
   *
   * @returns {Tooltip}
   * @private
   */
  _createTooltip = () => {
    return (
      <div className="tooltipContentWrap" onClick={this._closeTooltip}>
        {this.props.request.message}
      </div>
    )
  };

  _styles = () => {
    return {
      floater: {
        filter: 'unset',
        maxWidth: 'content-box',
      },
      container: {
        cursor: 'auto',
        backgroundColor: '#b1462a',
        color: '#fff',
        minHeight: 20,
        padding: 5,
        borderRadius: 3
      },
      arrow: {
        color: '#b1462a',
        display: 'inline-flex',
        length: 7,
        position: 'absolute',
        spread: 14,
      },
    };
  };

  render() {
    const { errorTooltip, request, passiveOnError } = this.props;

    if (errorTooltip && request.message) {

      return (
        <Floater
          offset={1}
          open={this.state.open}
          content={this._createTooltip()}
          placement="auto"
          styles={this._styles()}
        >
          <span>{this._children()}</span>
        </Floater>
      );
    }

    if(passiveOnError){
      return this._children();
    }

    if(request.message) {
      return (
        <div className="requestErrorContainer">
          <div>{request.message}</div>
        </div>
      );
    }

    return (
      <div className="requestErrorContainer">
        <div>An error occurred. Please try again later.</div>
      </div>
    );

  };
}

export default RequestError;
