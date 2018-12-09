// @flow
import nonEmpty from './nonEmpty';

/**
 * Checks if arg is an object and not null
 * @param obj
 * @returns {any|boolean}
 */
export default function isObj (obj: any):%checks {
  /* eslint-disable eqeqeq */
  return nonEmpty(obj) && obj.constructor == Object
}
