// @flow
import React from 'react';
import type { Node } from 'react';
import Popover from 'react-popover';
import type { RequestState, RequestActions, RequestProp } from '../../index';
import { isFunc, isObj, nonEmpty } from '../../module/helper';
import './RequestSuccess.scss';


type Props = {
  id: string,
  request: RequestState,
  actions: RequestActions,
  children: Array<Node> | Node,
  popoverOnSuccess?: boolean,
  successReplace?: boolean,
  onCloseSuccess: (id: any) => any,
  inject?: boolean | (request: RequestProp) => Object,
  className?: string

}

type State = {
  open: boolean
}

/**
 * Renders a successful request if popoverOnSuccess is set true or successReplace is set
 */
class RequestSuccess extends React.Component<Props, State> {
  props: Props;

  state: State = { open: true };

  defaultSuccessMessage = 'Successful';


  componentWillUnmount() {
    this.closePopover();
  }


  /**
   * Close tooltip
   * @private
   */
  closePopover = () => {
    const { id, actions, onCloseSuccess, request } = this.props;
    const { open } = this.state;

    //  handle callback
    if (open && isFunc(onCloseSuccess)) {
      onCloseSuccess({ data: request, actions });
    }
    //  remove request if set to autoRemove
    if (open && (request.autoRemove || request.removeOnSuccess)) {
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
   * Recreates children if inject is set true
   * @returns {Props.children}
   * @private
   */
  children = () => {
    const { children, request, inject, actions } = this.props;
    const injection = { request: { data: request, actions }};

    if (React.isValidElement(children)) {
      //  Map requestState to child props via inject function
      if (isFunc(inject)) {
        const params = inject(injection.request);
        const paramProps = isObj(params) ? params : { request: params };
        //  $FlowFixMe
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
   * @returns {Tooltip}
   * @private
   */
  createContent = () => {
    const { request } = this.props;
    let title;
    if (request.message.title) {
      title = React.isValidElement(request.message.title) ? request.message.title : (
        <div className="q-tooltip-title-success">
          {request.message.title}
        </div>
      )
    }

    const message = request.message.body ? request.message.body : request.message;

    /* eslint-disable jsx-a11y/interactive-supports-focus */
    return (
      <div
        role="button"
        onKeyPress={this.keyClosePopover}
        className="q-tooltip-content-success"
        onClick={this.closePopover}
      >
        {title}
        {message}
      </div>
    )
  };

  render() {
    const { popoverOnSuccess, successReplace, request, className = '' } = this.props;
    const { open } = this.state;

    if (successReplace) {
      if (React.isValidElement(request.message)) {
        return request.message;
      }

      return (
        <div className="successContainer">
          <div>
            {nonEmpty(request.message) && !isObj(request.message) ? request.message
              : this.defaultSuccessMessage
            }
          </div>
        </div>
      );
    }

    if (popoverOnSuccess && request.message) {
      const classNames = 'requestSuccessPopover ' + className;

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

    return this.children();
  };
}

export default RequestSuccess;
