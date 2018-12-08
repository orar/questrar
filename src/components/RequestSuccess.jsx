// @flow
import React from 'react';
import type { Node } from 'react';
import isFunc from '../utils/isFunc';
import createChildren from '../utils/createChildren';
import type { RequestActions, RequestState, RequestProp } from '../index';

type Props = {
  request: RequestState,
  actions: RequestActions,
  inject?: boolean | (request: RequestProp) => Object,
  onSuccess: Node | (r: RequestProp, children?: Node) => Node,
  children: Node
}

/* eslint-disable max-len */
/**
 * @param id                A request Id
 * @param request           A request state with request actions specified by the rId
 * @param inject            Inject the request state and actions into the children component
 * @param onSuccess         An optional function that should be call with the request state on pending
 * @param children          The wrapped component
 *
 * @returns RequestSuccess component
 * @constructor
 */
const RequestSuccess = ({ request, inject, onSuccess, children }: Props) => {
  if (isFunc(onSuccess)) {
    return onSuccess(request, children);
  }

  if (onSuccess) {
    return onSuccess;
  }

  return createChildren({ children, inject, request });
};


export default RequestSuccess;
