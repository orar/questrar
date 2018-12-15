// @flow
import React from 'react';
import type { Node } from 'react';
import isFunc from '../utils/isFunc';
import type { RequestProp } from '../index';
import handleOnPending from './RequestPending';

type Props = {
  request: RequestProp,
  inject?: boolean | (request: RequestProp) => Object,
  pendOnMount: Node | (r: RequestProp, children?: Node) => Node | boolean,
  children: Node
}

/* eslint-disable max-len */
/**
 * This is rendered once until any of the flags is set true.
 *
 * @param id         A request Id
 * @param request    A request state specified by the id with request action
 * @param inject     Inject the request state and actions into the children component
 * @param pendOnMount An optional function that should be call with the request state on pending
 * @param children    The wrapped component
 *
 * @returns RequestPendOnMount component
 * @constructor
 */
export default function handlePendOnMount ({
  pendOnMount,
  request,
  children,
  inject,
  ...rest
}: Props) {
  if (isFunc(pendOnMount)) {
    return pendOnMount(request, children)
  }

  if (React.isValidElement(pendOnMount)) {
    return pendOnMount;
  }

  return handleOnPending({ request, inject, children, ...rest });
}
