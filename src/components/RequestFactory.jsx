import React from 'react';
import type { Node } from 'react';
import createChildren from '../utils/createChildren';
import type { RequestActions, RequestProp, RequestState } from '../index';
import handleOnPending from './RequestPending';
import handlePendOnMount from './RequestPendOnMount';
import isFunc from '../utils/isFunc';


type RequestFactoryProps = {
  request: RequestState,
  actions: RequestActions,
  pendOnMount?: Node | (r: RequestProp, children?: Node) => Node | boolean,
  onFailure?: Node | (r: RequestProp, children?: Node) => Node,
  onSuccess?: Node | (r: RequestProp, children?: Node) => Node,
  inject?: boolean | (request: RequestProp) => Object,

  children: Array<Node> | Node,
}


/* eslint-disable max-len */
/**
 * @param id                A request Id
 * @param request           A request state specified by the rId
 * @param inject            Inject the request state and actions into the children component
 * @param onFailure         An optional function that should be call with the request state(containing error)
 * @param onSuccess         An optional function that should be call with the request state on pending
 * @param children          The wrapped component
 *
 * @returns RequestFailure component
 * @constructor
 */
export default function renderRequestState(props: RequestFactoryProps){
  const requestData = props.request.data;
  const { onFailure, onSuccess, request, children } = props;

  if (requestData.failed) {
    if (isFunc(onFailure)) return onFailure(request, children);

    if (onFailure) return onFailure;

    return createChildren(props);
  }

  if (requestData.success) {
    if (isFunc(onSuccess)) return onSuccess(request, children);

    if (onSuccess) return onSuccess;

    return createChildren(props);
  }

  if (requestData.pending) {
    return handleOnPending(props);
  }

  /*
   At default, a requestState has all flags (pending, success, failed) to be false.
   Until the requestState changes, `pendOnMount` set will render a custom or loading component
   Can be a useful escape if the underlying component may have rendering issues or even throw
   if there is no data.
   */
  if (props.pendOnMount) {
    return handlePendOnMount(props);
  }

  return createChildren(props);
}
