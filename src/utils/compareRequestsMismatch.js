// @flow
import type { ProviderRequestState, RequestState, RequestId } from '../index';

/**
 * Compares two request objects if they mismatch.
 * If mismatch, return true
 *
 * @param current Request object
 * @param next Request object
 * @returns {boolean}
 */
export function compareRequestsMismatch(
  current: RequestState,
  next: RequestState
): boolean {
  return current.$id !== next.$id || current.id !== next.id
}

/**
 * Sorts an array of request ids
 * @param a
 * @param b
 * @returns {number}
 */
export const sortKeys = (a: RequestId, b: RequestId) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1
  }

  return 0;
};

/**
 * Compares multiple request states by linear comparison of sorted keys
 * @param current
 * @param next
 * @returns {boolean}
 */
export function compareMultiRequestMismatch(
  current: ProviderRequestState,
  next: ProviderRequestState
): boolean {
  let currentKeys = Object.keys(current);
  let nextKeys = Object.keys(next);

  if (currentKeys.length !== nextKeys.length) return true;

  currentKeys = currentKeys.sort(sortKeys);
  nextKeys = nextKeys.sort(sortKeys);

  for (let i = 0; i < currentKeys.length; i += 1) {
    const currentValue = current[currentKeys[i]];
    const nextValue = next[nextKeys[i]];

    if (
      currentValue.$id !== nextValue.$id
      || currentValue.id !== nextValue.id
    ) return true;
  }
  return false;
}
