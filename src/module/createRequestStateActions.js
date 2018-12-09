// @flow
import { CLEAN, DIRTY, FAILED, PENDING, REMOVE, SUCCESS } from '../utils/common';
import type { StateProvider, RequestId } from '../index';


/**
 * Sets a request state to success
 * @param state
 * @returns {Function}
 */
export const success = (state: StateProvider) => (id: RequestId, message: any) => {
  state.updateRequest({ id, message, status: SUCCESS })
};

/**
 * Sets a request state to failed
 * @param state
 * @returns {Function}
 */
export const failed = (state: StateProvider) => (id: RequestId, message: any) => {
  state.updateRequest({ id, message, status: FAILED })
};

/**
 * Sets a request state to pending
 * @param state
 * @returns {Function}
 */
export const pending = (state: StateProvider) => (id: RequestId, message: any) => {
  state.updateRequest({ id, message, status: PENDING })
};

/**
 * Sets a request state to remove
 * @param state
 * @returns {Function}
 */
export const remove = (state: StateProvider) => (id: RequestId) => {
  state.updateRequest({ id, status: REMOVE })
};

/**
 * Sets a request state to dirty
 * @param state
 * @returns {Function}
 */
export const dirty = (state: StateProvider) => (id: RequestId) => {
  state.updateRequest({ id, status: DIRTY })
};

/**
 * Sets a request state to clean
 * @param state
 * @returns {Function}
 */
export const clean = (state: StateProvider) => (id: RequestId) => {
  state.updateRequest({ id, status: CLEAN })
};

/**
 * Creates request state actions for updating a single request state
 * @param stateProvider
 * @returns {function(): *}
 */
export default function createRequestStateActions(stateProvider: StateProvider) {
  function actions () {
    return stateProvider.name;
  }

  actions.success = success(stateProvider);
  actions.pending = pending(stateProvider);
  actions.failed = failed(stateProvider);
  actions.remove = remove(stateProvider);
  actions.dirty = dirty(stateProvider);
  actions.clean = clean(stateProvider);

  return actions
}
