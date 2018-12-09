// @flow
import React from 'react';
import invariant from 'invariant';
import isFunc from './isFunc'

/**
 * Extracts a list of request Ids from component children where `id` prop is an extract function
 *
 * @param props Props of component (Requests component)
 * @returns {*}
 */
export default (props: Object): Array<string | number> => {
  invariant(isFunc(props.id), `Expected id to be a function, instead of ${typeof props.id}`);

  const hasChildren = props.children && React.Children.count(props.children) >= 1;
  const mapId = props.id;


  if (!hasChildren) {
    return [];
  }

  return React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      if (child.props.requestFactoryType) {
        return child.props.id;
      }
      return mapId(child.props)
    }
    return null;
  }).filter(Boolean);
};
