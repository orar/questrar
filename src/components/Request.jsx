// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import type { Node } from 'react';
import invariant from 'invariant';
import type { RequestProp, StateProvider } from '../index';
import withSingleRequest from '../module/withSingleRequest';
import renderRequestState from './RequestFactory';
import isRequestId from '../utils/isRequestId';


type Props = {
  id: string,
  children: Array<Node> | Node,
  request: RequestProp,
  pendOnMount?: Node | (r: RequestProp, children?: Node) => Node | boolean,
  onFailure?: Node | (r: RequestProp, children?: Node) => Node,
  onSuccess?: Node | (r: RequestProp, children?: Node) => Node,
  onPending?: Node | (r: RequestProp, children?: Node) => Node,
  inject?: boolean | (request: RequestProp) => Object,

  provider?: StateProvider
}


/**
 * Renders a Request feedback in/around a requesting component
 * @returns {*}
 * @constructor
 */
export class Request extends React.Component<Props> {
  props: Props;

  constructor(props: Props) {
    invariant(
      isRequestId(props.id),
      `Request: Expected 'id' prop to be any of string, number and symbol, instead of ${typeof props.id}`
    );
    super(props);
  }

  render() {
    return renderRequestState(this.props);
  }
}

export default withSingleRequest(Request);
