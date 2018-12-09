// @flow
import type { Store } from 'redux';
import invariant from 'invariant'
import { FAILED, PENDING, REMOVE, SUCCESS, DIRTY, CLEAN } from '../utils/common';
import type { ProviderRequestState, StateProvider } from '../index';
import { REQUEST_ACTION_TYPE } from './common';
import createRequestState from './createRequest';
import nonEmpty from '../utils/nonEmpty'
import RequestSubscription from '../store/RequestSubscription';

/**
 * Gets the current redux request state from store with no verification
 * @returns {*}
 */

export function getProviderState(s: Store, path: string, name: string) {
  const state = s.getState();
  const paths = path.split('.');
  let rState = state;
  for (let i = 0; i < paths.length; i += 1) {
    if (paths[i] && Object.hasOwnProperty.call(rState, paths[i])) {
      rState = rState[paths[i]]
    } else if (paths[i]) {
      invariant(false, `${name}: '${path}' looks incorrect. '${paths[i]}' does not exist`)
    }
  }
  return rState;
}

/**
 * Create a redux to Provider request state mapper
 *
 * if path is more than one level deep in the store state, path should be delimited by a dot (.)
 * e.g. 'app.operation.ticket' === { app: { operation: { ticket: { requestState }}}}
 *
 * @param store The redux store
 * @param path The store path of request state
 * @returns {{getState: getState, putState: putState}}
 */
export default function createStateProvider (store: Store, path?: string = ''): StateProvider {
  const name = 'Redux.State.Provider';

  invariant(store, `${name}: redux store object is required`);

  const s = store;

  const subscribers = new RequestSubscription();

  let unsubscribeStore;

  /**
   *  Request state identity
   *  Since no two symbols created (Symbol()) are equal every time an update is made to store,
   *  a new symbol should be created with request id as symbol key
   *
   *  On state change, if id is not equal to state change id,
   *  then a state update should have happened.
   *  This should trigger a notification to local subscribers
   */
  let id: Symbol;

  /**
   * Redux store absolute path to request state
   * i.e. user custom state path + reducer id
   *
   * @type {string}
   * @private
   */
  const statePath = `${path}.${REQUEST_ACTION_TYPE}`;

  /**
   * Gets state data from redux store
   * @returns {*}
   */
  function getState() {
    const state = getProviderState(s, statePath, name);
    if (nonEmpty(state) && nonEmpty(state.data)) {
      return state.data;
    }
    return {};
  }

  /**
   * Notifies subscribers of request state update
   * @returns {Function}
   * @private
   */
  function runUpdate() {
    const state = getProviderState(s, statePath, name);
    if (Object.hasOwnProperty.call(state, 'id')) {
      if (state.id !== id) {
        /* eslint-disable-next-line prefer-destructuring */
        id = state.id;
        subscribers.notify(state);
      }
    }
  }

  /**
   * Watches the request state and run update to notify subscribers if there's been a change.
   *
   * For efficiency, redux stateProvider needs to avoid unnecessary notifications
   * by tracking only state updates bounded to request states in redux.
   * This means we need to know what has changed and hasnt.
   * This can easily be done with comparing previous state and current,
   * thus we got to save some state which is the `state.id`.
   * Upon request update, stateId changes.
   * The local id will not match the current state.id leading to update.
   * The current will be set as local for next update comparison.
   *
   * However, in this way, only the first subscriber will be notified of the current store update
   * because it sets the current state id as local blocking all other subscribers.
   *
   * Setting a single subscriber function to redux store to in turn run updates and
   * saving all subscribers locally can make state observation very better off.
   *
   */
  function observe(update: (state: ProviderRequestState) => any) {
    if (!subscribers.isSubscribed) {
      unsubscribeStore = store.subscribe(runUpdate);
    }
    const unsubscribeSelf = subscribers.subscribe(update);

    return function unsubscribe () {
      unsubscribeSelf();
      if (!subscribers.isSubscribed) {
        unsubscribeStore();
      }
    }
  }

  /**
   * Dispatches specific request state update action to redux store
   * @param action
   */
  function updateRequest(action: Object) {
    const req = createRequestState(action.id);
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
    name, getState, updateRequest, observe,
  };
}
