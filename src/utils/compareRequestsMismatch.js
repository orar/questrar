// @flow

/**
 * Compares two request objects if they mismatch.
 * If mismatch, return true
 *
 * @param current Request object
 * @param next Request object
 * @returns {boolean}
 */
export default function compareRequestsMismatch(current: Object, next: Object): boolean {
  return current !== next
}
