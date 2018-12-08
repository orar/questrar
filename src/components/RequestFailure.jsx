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
  onFailure: Node | (r: RequestProp, children?: Node) => Node,
  children: Node
}

/* eslint-disable max-len */
/**
 * @param id                A request Id
 * @param request           A request state specified by the rId
 * @param inject            Inject the request state and actions into the children component
 * @param onFailure         An optional function that should be call with the request state(containing error)
 * @param children          The wrapped component
 *
 * @returns RequestFailure component
 * @constructor
 */
const RequestFailure = ({ request, inject, onFailure, children }: Props) => {
  if (isFunc(onFailure)) {
    return onFailure(request, children);
  }

  if (onFailure) {
    return onFailure;
  }

  return createChildren({ children, inject, request });
};

export default RequestFailure;
