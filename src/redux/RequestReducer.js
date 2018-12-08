// @flow
import { PENDING, SUCCESS, FAILED, CLEAN, DIRTY, initialRequest, REMOVE } from '../utils/common';
import { REQUEST_ACTION_TYPE } from './common';
import type { RequestState, ReduxRequestState, ProviderRequestState } from '../index';
import resetFlags from '../utils/resetRequestFlags'

/**
 * Initial state of request reducer
 * @type {{data: {}}}
 */
export const initialState = { id: '', data: {} };

/**
 * Get requestState from state by request id
 * @param state
 * @param id
 * @returns {*}
 */
export function getRequestState(state: ProviderRequestState, id: string | number) {
  if (Object.hasOwnProperty.call(state, id)) {
    return Object.assign({}, state[id]);
  }
  return { ...initialRequest, id };
}


/**
 * Set request state message if provided as part of action
 * @param state
 * @param action
 */
export function setMessage(state: RequestState, action: Object) {
  const s = state;
  if (action.message) {
    s.message = action.message;
  }
  return s;
}

export function handleRequest (
  transformState: (request: RequestState, action: Object) => RequestState
): (request: RequestState, action: Object) => ReduxRequestState {
  return (state: ReduxRequestState, action: Object): ReduxRequestState => {
    const { id } = action;
    const stateId = Symbol(id);

    const next = getRequestState(state.data, id);
    const nextReq = transformState(next, action);

    const data = Object.assign({}, state.data, { [id]: nextReq });
    return { id: stateId, data };
  }
}

/**
 * Updates a request to pending
 *
 * @returns {{} & RequestState}
 */
export function handleRequestPending (state: ReduxRequestState, action: Object): ReduxRequestState {
  return handleRequest((request, reqAction) => {
    const next = resetFlags(request);
    next.pending = true;
    return setMessage(next, reqAction);
  })(state, action)
}


/**
 * Updates a request to clean state
 *
 * @returns {{} & RequestState}
 */
export function handleRequestClean (state: ReduxRequestState, action: Object): ReduxRequestState {
  return handleRequest((request) => {
    const next = request;
    next.clean = true;
    return next;
  })(state, action);
}

/**
 * Updates a request to dirty state
 *
 * @returns {{} & RequestState}
 */
export function handleRequestDirty (state: ReduxRequestState, action: Object): ReduxRequestState {
  return handleRequest((request) => {
    const next = request;
    next.clean = false;
    return next;
  })(state, action);
}


/**
 * Updates a request state to failed
 * @params state, action
 * @returns {{} & RequestState}
 */
export function handleRequestFailed (state: ReduxRequestState, action: Object) {
  return handleRequest((request, reqAction) => {
    const next = resetFlags(request);
    next.failed = true;
    next.failureCount += 1;
    return setMessage(next, reqAction);
  })(state, action);
}

/**
 * Updates a request state to success.
 * Autodeletes a request if set to true
 *
 * @params state, action
 * @returns {{} & RequestState}
 */
export function handleRequestSuccess (state: ReduxRequestState, action: Object): ReduxRequestState {
  return handleRequest((request, reqAction) => {
    const next = resetFlags(request);
    next.success = true;
    next.successCount += 1;
    return setMessage(next, reqAction)
  })(state, action);
}


/**
 * Remove request state from redux
 * @param state
 * @param action
 * @returns {*}
 */
export function removeRequestState (state: ReduxRequestState, action: Object): ReduxRequestState {
  const { id } = action;
  const nextState = state;

  if (Object.hasOwnProperty.call(nextState.data, id)) {
    const stateId = Symbol(id);
    const { data } = nextState;
    delete data[id];
    return { id: stateId, data };
  }
  return nextState;
}

/**
 * Request state reducer for redux
 * @param state Initial state
 * @param action redux action dispatched
 * @returns {*} Final state
 */
export function rootReducer(state: ReduxRequestState, action: Object) {
  const oldState = Object.assign(initialState, state);

  const payload = action && action.payload ? action.payload : {};

  switch (payload.status) {
    case PENDING:
      return handleRequestPending(oldState, payload);

    case SUCCESS:
      return handleRequestSuccess(oldState, payload);

    case FAILED:
      return handleRequestFailed(oldState, payload);

    case CLEAN:
      return handleRequestClean(oldState, payload);

    case DIRTY:
      return handleRequestDirty(oldState, payload);

    case REMOVE:
      return removeRequestState(oldState, payload);

    default:
      return oldState;
  }
}

export default { [REQUEST_ACTION_TYPE]: rootReducer };
