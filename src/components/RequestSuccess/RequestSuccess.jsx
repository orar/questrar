// @flow
import React from 'react';
import type { Node } from 'react';
import Popover from 'react-popover';
import type { RequestState, RequestActions, RequestProp } from '../../index';
import { isFunc } from '../../module/helper';
import PopoverContent from '../PopoverContent';
import Banner from '../Banner';
import './RequestSuccess.scss';
import { createChildren } from '../Common';


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

  componentWillUnmount() {
    this.closePopover();
  }

  /**
   * Close tooltip
   * @private
   */
  closePopover = () => {
    const { id, actions, onCloseSuccess, request } = this.props;

    if (request.clean) {
      if (isFunc(onCloseSuccess)) {
        onCloseSuccess({ data: request, actions });
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
        className="q-popover-content-success"
        titleClassName="q-popover-title-success"
        bodyClassName="q-popover-body-success"
        onClose={this.closePopover}
      />
    )
  };

  render() {
    const { popoverOnSuccess, successReplace, request, className = '' } = this.props;
    const { open } = this.state;

    if (successReplace) {
      return (
        <Banner
          message={request.message}
          className="successContainer"
        />
      );
    }

    if (popoverOnSuccess && request.message) {
      const classNames = 'requestSuccessPopover ' + className;

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

    return this.children();
  };
}

export default RequestSuccess;
