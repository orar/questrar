// @flow
import React from 'react';
import isFunc from './isFunc'
import isObj from './isObj'

/**
 * Recreates a single child component wrapped around by Request component
 *
 * <UserComponent
 *  inject={({ data, actions}) => ({
 *   onClick: () => data.pending ? actions.success(data.id) : () => {}
 *  })}
 * />
 *
 * @param children
 * @param request
 * @param inject
 * @param actions
 * @returns {*}
 */
export default ({ children, request, inject }: Object) => {
  if (inject && React.isValidElement(children) && React.Children.count(children) === 1) {
    //  Map requestState to child props via inject function
    const params = isFunc(inject) ? inject(request) : { request };
    const paramProps = isObj(params) ? params : { request: params };
    // $FlowFixMe
    return React.cloneElement(children, paramProps);
  }
  return children;
};
