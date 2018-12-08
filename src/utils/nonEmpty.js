// @flow

/**
 * Assert if value is not null or not undefined
 *
 * @param value
 * @returns {boolean}
 */
export default function nonEmpty(value: any):%checks {
  return typeof value !== 'undefined' && value !== null
}
