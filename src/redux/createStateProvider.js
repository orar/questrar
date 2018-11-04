// @flow
import type { Store } from 'redux';
import invariant from 'invariant'
import { FAILED, PENDING, REMOVE, SUCCESS, REPLACE, DIRTY, CLEAN } from '../module/common';
import type { ProviderRequestState } from '../index';
import { REDUX_STATE_PATH, REQUEST_ACTION_TYPE } from './common';
import createRequestState from './createRequest';
import { nonEmpty, isFunc } from '../module/helper';

/**
 * Gets the redux request state current
 * @returns {*}
 */

export function getRawState(s: Store, path: string) {
  const state = s.getState();
  const paths = path.split('.');
  let rState = state;
  for (let i = 0; i < paths.length; i += 1) {
    if (paths[i] && Object.hasOwnProperty.call(rState, paths[i])) {
      rState = rState[paths[i]]
    } else if (paths[i]) {
      invariant(false, `State path: '${path}' looks incorrect. '${paths[i]}' does not exist`)
    }
  }
  return rState;
}

/**
 * Create a redux to questrar request state mapper
 * It uses replace state to sync from provider to redux and back
 *
 * if path is more than one level deep in the store state, path should be delimited by a dot (.)
 * e.g. 'app.operation.ticket' === { app: { operation: { ticket: { requestState }}}}
 *
 * @param store The redux store
 * @param path The store path of request state
 * @returns {{getState: getState, putState: putState}}
 */
export default function createStateProvider (store: Store, path?: string) {
  const s = store;

  /**
   *  Request state identity
   *  Since no two symbol created (Symbol()) are not equal
   *  every time an update is made to store, a new symbol should be created
   *
   *  On state change, if id is not equal to state id, then a state update should have happened.
   *  This should call Provider to force update
   */
  let id: Symbol;

  /**
   * Unsubscribe function
   */
  let unsubscribe: () => void;

  /**
   * Redux store absolute path to request state
   * i.e. user preferred state path + reducer id
   *
   * @type {string}
   * @private
   */
  const statePath = `${path || REDUX_STATE_PATH}.${REQUEST_ACTION_TYPE}`;

  /**
   * Get state data
   * @returns {*}
   */
  function getState() {
    const state = getRawState(s, statePath);
    if (nonEmpty(state) && nonEmpty(state.data)) {
      return state.data;
    }
    return {};
  }

  /**
   * Replace the entire request state into redux
   * CAVEAT: Prone to corrupt request state
   * TODO: dispatch requestState specific update
   *
   * @param state
   */
  function putState(state: ProviderRequestState) {
    s.dispatch({ type: REPLACE, payload: state });
  }


  /**
   * Run update to the Request provider
   * @param update
   * @returns {Function}
   * @private
   */
  function runUpdate(update: (shouldUpdate: boolean) => any) {
    return function run () {
      const rs = getRawState(s, statePath);
      if (Object.hasOwnProperty.call(rs, 'id')) {
        if (rs.id !== id) { // update if state id has changed since the last update
          /* eslint-disable prefer-destructuring */
          id = rs.id;
          update(true)
        }
      }
    }
  }

  /**
   * Watches the request state and run update of RequestProvider if there's been a change.
   *
   * @param update
   */
  function observe(update: (shouldUpdate: boolean) => any) {
    unsubscribe = store.subscribe(runUpdate(update));
  }


  /**
   * Releases resources attached to store
   */
  function release() {
    if (isFunc(unsubscribe)) {
      unsubscribe()
    }
  }

  /**
   * Dispatch request state specific updates to redux store
   * @param action
   */
  function updateRequest(action: Object) {
    const req = createRequestState(action.id, action);
    let requestAction;
    switch (action.status) {
      case PENDING:
        requestAction = req.pending(action.message);
        break;
      case FAILED:
        requestAction = req.failed(action.message);
        break;
      case SUCCESS:
        requestAction = req.success(action.message);
        break;
      case DIRTY:
        requestAction = req.dirty();
        break;
      case CLEAN:
        requestAction = req.clean();
        break;
      case REMOVE:
        requestAction = req.remove();
        break;
      default:
        break;
    }
    if (nonEmpty(requestAction)) {
      s.dispatch(requestAction)
    }
  }


  return {
    getState, putState, updateRequest, observe, release, path: statePath,
  };
}
