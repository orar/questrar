import React from 'react';
import type { Node } from 'react';
import createChildren from '../utils/createChildren';
import type { RequestActions, RequestProp, RequestState } from '../index';
import RequestSuccess from './RequestSuccess';
import RequestFailure from './RequestFailure';
import RequestPending from './RequestPending';
import RequestPendOnMount from './RequestPendOnMount';


type RequestFactoryProps = {
  request: RequestState,
  actions: RequestActions,
  pendOnMount?: Node | (r: RequestProp, children?: Node) => Node | boolean,
  onFailure?: Node | (r: RequestProp, children?: Node) => Node,
  onSuccess?: Node | (r: RequestProp, children?: Node) => Node,
  inject?: boolean | (request: RequestProp) => Object,

  children: Array<Node> | Node,
}

export default (props: RequestFactoryProps) => {
  const requestData = props.request.data;

  if (requestData.pending) {
    return <RequestPending requestFactoryType id={requestData.id} {...props} />
  }

  if (requestData.failed) {
    return <RequestFailure requestFactoryType id={requestData.id} {...props} />
  }

  if (requestData.success) {
    return <RequestSuccess requestFactoryType id={requestData.id} {...props} />
  }

  // At default requestState, all flags (pending, success, failed) are false.
  // Until the requestState changes, render a loading component
  // Usually used when if there is no data the
  // underlying component may have rendering issues or even throw
  if (props.pendOnMount) {
    return <RequestPendOnMount requestFactoryType id={requestData.id} {...props} />
  }

  return createChildren(props);
};
