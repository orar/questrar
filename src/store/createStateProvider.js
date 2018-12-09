// @flow
import invariant from 'invariant'
import type { RequestState } from '../index';
import { CLEAN, DIRTY, FAILED, initialRequest, PENDING, REMOVE, SUCCESS } from '../utils/common';
import resetRequestFlags from '../utils/resetRequestFlags';
import type { Subscriber, SubscriptionOptions } from './RequestSubscription';
import type { RequestStore } from './Store'
import warn from '../utils/warn';

export default function createStateProvider(requestStore: RequestStore) {
  invariant(requestStore, 'Required: Request store is required');

  const name = 'Default.State.Provider';

  const store = requestStore;

  function saveState (request: RequestState) {
    const stateId = Symbol(request.id);
    return store.updateState(stateId, request)
  }

  const applyStateChange = (id: string) => (transform: (req: RequestState) => RequestState) => {
    const state = store.getState();
    const exist = Object.hasOwnProperty.call(state.data, id);
    const request = exist ? state.data[id] : initialRequest;
    const req = resetRequestFlags(Object.assign({}, request));
    req.id = id;
    const nextRequest = transform(req);
    return saveState(nextRequest);
  };

  /**
   * Updates a request to successful and increments the success count of the particular request
   * @param id Request Id
   * @param message An optional message for update
   * @private
   */
  const requestSuccessful = (id: string, message?: any) => {
    const updateSuccess = (request: RequestState) => {
      const req = request;
      req.success = true;
      req.successCount += 1;

      if (message) {
        req.message = message;
      }
      return req;
    };
    return applyStateChange(id)(updateSuccess)
  };

  /**
   * Updates a request to failed and increments the failure count of the particular request
   * @param id Request Id
   * @param message An optional message for update
   * @private
   */
  const requestFailed = (id: string, message?: any) => {
    const updateFailed = (request: RequestState) => {
      const req = request;
      req.failed = true;
      req.failureCount += 1;

      if (message) {
        req.message = message;
      }
      return req;
    };
    return applyStateChange(id)(updateFailed)
  };

  /**
   * Updates a request request to pending
   *
   * @param id Request id
   * @param message An optional message for the update. Example 'loading...'
   * @private
   */
  const requestPending = (id: string, message?: any) => {
    const updatePending = (request: RequestState) => {
      const req = request;
      req.pending = true;
      req.clean = true;

      if (message) {
        req.message = message;
      }
      return req;
    };
    return applyStateChange(id)(updatePending)
  };

  /**
   * Set request to clean falsey
   * @param id Request id
   * @private
   */
  const requestDirty = (id: string) => {
    const makeDirty = (request: RequestState) => {
      const req = request;
      req.clean = false;
      return req;
    };
    return applyStateChange(id)(makeDirty)
  };

  /**
   * Set request to clean
   * @param id Request id
   * @private
   */
  const requestClean = (id: string) => {
    const makeClean = (request: RequestState) => {
      const req = request;
      req.clean = true;
      return req;
    };
    return applyStateChange(id)(makeClean);
  };

  /**
   * Removes request from request state
   *
   * @param id
   * @private
   */
  const removeRequest = (id: string) => {
    const state = store.getState();
    if (!Object.hasOwnProperty.call(state.data, id)) return null;

    return store.removeState(Symbol(id), id)
  };

  /**
   * Gets current state of store
   * @returns {RequestStoreState}
   */
  function getState () {
    const state = store.getState();
    return state.data;
  }

  /**
   * Observes store state for state changes.
   * Subscriber state change notification can be scoped to a particular group of request states
   * using the id param
   *
   * @param subscriber State change subscriber
   * @param options A list of context/scope id for which a subscriber should be called
   *  if there is an update on any request state of this id
   * @returns {function(): void}
   */
  function observe (subscriber: Subscriber, options?: SubscriptionOptions = {}) {
    const { id } = options;
    if (id) {
      return store.subscribe(subscriber, options)
    }
    return store.subscribe(subscriber);
  }

  /**
   * Updates a request state
   * @param action
   */
  function updateRequest (action: Object) {
    const { id, message, status } = action;
    if (status) {
      switch (status) {
        case FAILED:
          requestFailed(id, message);
          break;
        case PENDING:
          requestPending(id, message);
          break;
        case SUCCESS:
          requestSuccessful(id, message);
          break;
        case DIRTY:
          requestDirty(id);
          break;
        case CLEAN:
          requestClean(id);
          break;
        case REMOVE:
          removeRequest(id);
          break;
        default:
          warn(`Questrar: ${name} - unknown request status: ${status}.
          Use any of ${SUCCESS}, ${FAILED}, ${PENDING}, ${DIRTY}, ${CLEAN} or ${REMOVE}
          `);
          break;
      }
    }
  }

  /*
  * Bound provider methods to object to avoid leak of
  * external scope of which createStateProvider.this depends;
  */
  const provider = {
    name,
    getState: getState.bind(this),
    observe: observe.bind(this),
    updateRequest: updateRequest.bind(this)
  };

  return Object.freeze(provider);
}
