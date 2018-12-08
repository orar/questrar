// @flow
import nonEmpty from './nonEmpty';
import isObj from './isObj';

/**
 * Checks if arg is an object and not null
 * @param obj
 * @returns {any|boolean}
 */
// $FlowFixMe
export default function isEmptyObj(value: any):%checks {
  if (!nonEmpty(value) || !isObj(value)) return true;

  return Object.keys(value).length === 0
}
