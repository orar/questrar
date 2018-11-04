// @flow
import React from 'react';
import Popover from 'react-popover';
import type { Node } from 'react';
import type { RequestActions, RequestState } from '../../index';
import { isFunc, nonEmpty } from '../../module/helper';
import PopoverContent from '../PopoverContent';
import Banner from '../Banner';
import { createChildren } from '../Common';
import './RequestError.scss';

type Props = {
  id: string,
  request: RequestState,
  actions: RequestActions,
  children: Array<Node> | Node,
  popoverOnFail?: boolean,
  onCloseFailure?: (data: any) => any,
  passiveOnFail?: boolean,
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

    // handle onClose callback
    if (request.clean) {
      if (isFunc(onCloseFailure)) {
        onCloseFailure({ data: request, actions });
      }
      if (request.autoRemove || request.removeOnFail) {
        actions.remove(id);
      } else { actions.dirty(id) }
    }

    this.setState({ open: false });
  };

  /**
   * Recreates children if inject is set true
   * @returns {Props.children}
   * @private
   */
  children = () => createChildren(this.props);

  popoverContent = () => {
    const { request } = this.props;
    return (
      <PopoverContent
        message={request.message}
        className="q-popover-content-failed"
        titleClassName="q-popover-title-failed"
        bodyClassName="q-popover-body-failed"
        onClose={this.closePopover}
      />
    );
  };

  render() {
    const { popoverOnFail, inject, request, passiveOnFail, className = '' } = this.props;
    const { open } = this.state;

    if (popoverOnFail && request.message) {
      const classNames = 'requestFailurePopover ' + className;
      const content = this.popoverContent();

      return (
        <Popover
          isOpen={open}
          preferPlace="right"
          body={content}
          className={classNames}
        >
          {this.children()}
        </Popover>
      );
    }

    if (passiveOnFail || inject) {
      return this.children();
    }

    return (
      <Banner
        message={request.message}
        className="failureContainer"
        defaultMessage="An error occurred. Please try again later."
      />
    );
  };
}

export default RequestError;
