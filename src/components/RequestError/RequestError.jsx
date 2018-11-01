// @flow
import React from 'react';
import Popover from 'react-popover';
import type { Node } from 'react';
import type { RequestActions, RequestState } from '../../index';
import { isFunc, isObj } from '../../module/helper';
import './RequestError.scss';

type Props = {
  id: string,
  request: RequestState,
  actions: RequestActions,
  children: Array<Node> | Node,
  popoverOnFail?: boolean,
  onCloseFailure?: (data: any) => any,
  passiveOnFail: boolean,
  inject?: boolean | (request: RequestState) => Object,
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

  // close tooltip on unmount
  componentWillUnmount() {
    this.closePopover();
  }

  /**
   * Close tooltip and call backs
   * @private
   */
  closePopover = () => {
    const { id, actions, onCloseFailure, request } = this.props;
    const { open } = this.state;
    // handle callback
    if (open && isFunc(onCloseFailure)) {
      onCloseFailure({ data: request, actions });
    }
    // remove request if set to autoRemove
    if (open && (request.autoRemove || request.removeOnFail)) {
      actions.remove(id);
    } else { actions.dirty(id) }
    this.setState({ open: false });
  };

  /**
   * Close popover on esc key press
   * @param evt
   */
  keyClosePopover = (evt: Object) => {
    if (evt.keyCode === 27) {
      this.closePopover();
    }
  };

  /**
   * Recreates children if needed for request props injection
   * @returns {Props.children}
   * @private
   */
  children = () => {
    const { children, request, inject, actions } = this.props;
    const injection = { request: { data: request, actions }};

    if (React.isValidElement(children)) {
      // Transform requestState to child props via inject function
      if (isFunc(inject)) {
        const params = inject(injection.request);
        const paramProps = isObj(params) ? params : { request: params };
        // $FlowFixMe
        return React.cloneElement(children, paramProps);
      }
      if (inject) { // $FlowFixMe
        return React.cloneElement(children, injection);
      }
    }
    return children;
  };


  /**
   * Creates tooltip content
   *
   * @returns Tooltip
   * @private
   */
  createContent = () => {
    const { request } = this.props;
    let title;
    if (request.message.title) {
      title = React.isValidElement(request.message.title) ? request.message.title : (
        <div className="q-popover-title-failed">
          {request.message.title}
        </div>
      )
    }

    const message = !request.message.body ? request.message : (
      <div className="q-popover-body-failed">
        {request.message.body}
      </div>
    );

    /* eslint-disable jsx-a11y/interactive-supports-focus */
    return (
      <div
        role="button"
        onKeyPress={this.keyClosePopover}
        className="q-popover-content-failed"
        onClick={this.closePopover}
      >
        {title}
        {message}
      </div>
    )
  };

  render() {
    const { popoverOnFail, inject, request, passiveOnFail, className = '' } = this.props;
    const { open } = this.state;

    if (popoverOnFail && request.message) {
      const classNames = 'requestFailurePopover ' + className;

      return (
        <Popover
          isOpen={open}
          preferPlace="right"
          body={this.createContent()}
          className={classNames}
        >
          {this.children()}
        </Popover>
      );
    }

    if (passiveOnFail || inject) {
      return this.children();
    }

    if (React.isValidElement(request.message)) {
      return request.message;
    }

    if (isObj(request.message)) {
      return (
        <div className="failureContainer">
          {request.message.title}
          {request.message.body}
        </div>
      );
    }

    if (request.message) {
      return (
        <div className="failureContainer">
          {request.message}
        </div>
      );
    }

    return (
      <div className="failureContainer">
        <div>An error occurred. Please try again later.</div>
      </div>
    );
  };
}

export default RequestError;
