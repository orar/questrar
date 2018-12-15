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

  const hasNoChildren = React.Children.count(props.children) < 1;
  if (hasNoChildren) {
    return [];
  }

  const mapId = props.id;

  return React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return mapId(child.props)
    }
    return null;
  }).filter(Boolean);
};
