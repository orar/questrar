// @flow
import React from 'react';
import type { Node } from 'react';
import isFunc from '../utils/isFunc';
import createChildren from '../utils/createChildren';
import type { RequestProp } from '../index';
import Spinner from './Spinner';

type Props = {
  request: RequestProp,
  inject?: boolean | (request: RequestProp) => Object,
  onPending?: Node | (r: RequestProp, children?: Node) => Node | boolean,
  children: Node
}

/* eslint-disable max-len */
/**
 * @param id                A request Id
 * @param request           A request state specified by the id with request actions
 * @param inject            Inject the request state and actions into the wrapped component
 * @param onPending         An optional function that should be call with the request state on pending
 * @param children          The wrapped component
 *
 * @returns RequestPending component
 * @constructor
 */
const RequestPending = ({
  request,
  inject,
  onPending,
  children
}: Props) => {
  if (isFunc(onPending)) {
    return onPending(request, children);
  }

  if (React.isValidElement(onPending)) {
    return onPending;
  }

  if (inject) {
    return createChildren({ children, inject, request });
  }

  return <Spinner size={16} />;
};

export default RequestPending;
