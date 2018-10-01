// @flow
import React from 'react';
import { findDOMNode } from 'react-dom';
import type { Node } from 'react';
import './RequestError.scss';
import type {Request, RequestActions} from "../../QuestrarTypes";
import Tooltip from 'react-tooltip';



type Props = {
  id: string,
  request: Request,
  actions: RequestActions,
  failure?: boolean | string,
  children: Array<Node> | Node,
  errorTooltip?: boolean,
  onCloseError?: (data: any) => any,
  inject?: boolean | (request: Request) => Object,

}

type State = {
  disabled: boolean
}


/**
 * Error state automatically replaces children with default error message or custom.
 * Implementation of noErrorReplace turns this feature off
 * TODO: noErrorReplace: Render children even if error
 */
class RequestError extends React.Component<Props, State> {
  props: Props;
  state: State = { disabled: true };
  _ref: Node;

  /**
   * Sets the ref of the wrapping error node
   * @param ref
   * @private
   */
  _setRef = (ref: Node) => {
    console.log('setting ref');
    this.setState({ disabled: false });
    this._ref = ref;

    Tooltip.show(findDOMNode(this._ref));
    //Tooltip.rebuild();
  };

  /**
   * Hide the error message and disables tooltip
   * @private
   */
  _hideErrorMessage = () => {
    const { id, actions, onCloseError } = this.props;
    if(typeof onCloseError === "function"){
      onCloseError(id);
    }
    Tooltip.hide(findDOMNode(this._ref));
    this.setState({ disabled: true });
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

  /**
   * Generate tooltip content message for callback handling
   *
   * @param tip Error message
   * @returns {*}
   * @private
   */
  _getContent = (tip: any) => {
    return (
      <div onClick={this._hideErrorMessage}>
        {tip}
      </div>
    );
  };



  render() {
    const {id, errorTooltip, request} = this.props;

    if (errorTooltip && request.message) {

      return (
        <div>
          <span
            ref={this._setRef}
            data-for={id}
            data-type="error"
            data-event-off="click"
            data-tip-disable={this.state.disabled}
            data-tip={request.message}
          >
            {this._children()}
          </span>
          <Tooltip
            effect="solid"
            id={id}
            html
            multiline
            getContent={this._getContent}
          />
        </div>
      )
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
