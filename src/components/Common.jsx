// @flow
import React from 'react';
import { isObj, isFunc } from '../module/helper';

/* eslint-disable import/prefer-default-export */

export const createChildren = ({ children, request, inject, actions }: Object) => {
  const injection = { request: { data: request, actions }};

  if (inject && React.isValidElement(children)) {
    //  Map requestState to child props via inject function
    const params = isFunc(inject) ? inject(injection.request) : injection;
    const paramProps = isObj(params) ? params : { request: params };
    // $FlowFixMe
    return React.cloneElement(children, paramProps);
  }
  return children;
};
