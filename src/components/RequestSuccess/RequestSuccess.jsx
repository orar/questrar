// @flow
import React from 'react';
import type { Node } from 'react';
import './RequestSuccess.scss';
import type { RequestState, RequestActions, RequestProps } from "../../index";
import Floater from 'react-floater';
import {isFunc} from "../../module/helper";

type Props = {
  id: string,
  request: RequestState,
  actions: RequestActions,
  success?: boolean | string,
  children: Array<Node> | Node,
  successTooltip?: boolean,
  successReplace?: boolean,
  onCloseSuccess: (id: any) => any,
  inject?: boolean | (request: RequestProps) => Object,
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
        backgroundColor: '#71aa6f',
        color: '#fff',
        minHeight: 20,
        padding: 5,
        borderRadius: 3
      },
      arrow: {
        color: '#78b176',
        display: 'inline-flex',
        length: 7,
        position: 'absolute',
        spread: 14,
      },
    };
  };


  render() {
    const { children, successTooltip, successReplace, request} = this.props;


    if(successReplace) {
      return (
        <div className="requestSuccessContainer">
          <div>{request.message ? request.message : this._defaultSuccessMessage}</div>
        </div>
      );
    }

    if (successTooltip && request.message) {
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

    return children;

  };
}

export default RequestSuccess;
