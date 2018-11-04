// @flow
import invariant from 'invariant';
import { PENDING, SUCCESS, FAILED, REPLACE, CLEAN, DIRTY, initialRequest, REMOVE } from '../module/common';
import { REQUEST_ACTION_TYPE } from './common';
import { nonEmpty, resetRequestFlags as resetFlags } from '../module/helper';
import type { RequestState, ReduxRequestState, ProviderRequestState } from '../index';

/**
 * Initial state of request reducer
 * @type {{data: {}}}
 */
export const initialState = { data: {} };


/**
 * Sets removal  flags on request.
 *
 * @param state
 * @param action
 * @returns {*}
 */
export function setRemoves(state: Object, action: Object) {
  const s = state;

  if (action.autoRemove) {
    s.autoRemove = true
  }
  if (action.autoRemoveOnSuccess) {
    s.removeOnSuccess = true;
    if (s.autoRemove) {
      delete s.autoRemove;
    }
    return s;
  }

  if (action.autoRemoveOnFailure) {
    s.removeOnFail = true;
    if (s.autoRemove) {
      delete s.autoRemove;
    }
    return s;
  }

  return s;
}


/**
 * Get requestState from state by request id
 * @param state
 * @param id
 * @returns {*}
 */
export function getState(state: ProviderRequestState, id: string | number) {
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
    invariant(nonEmpty(action.id), 'request action missing id field');

    /* eslint-disable prefer-destructuring */
    const id = action.id;
    const stateId = Symbol(id);

    const next = getState(state.data, id);
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
  return handleRequest((r, a) => {
    const next = resetFlags(r);
    next.pending = true;
    return setMessage(next, a);
  })(state, action)
}


/**
 * Updates a request to clean state
 *
 * @returns {{} & RequestState}
 */
export function handleRequestClean (state: ReduxRequestState, action: Object): ReduxRequestState {
  return handleRequest((r) => {
    const next = r;
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
  return handleRequest((r) => {
    const next = r;
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
  return handleRequest((r, a) => {
    const next = resetFlags(r);
    next.failed = true;
    next.failureCount += 1;
    return setRemoves(setMessage(next, a), a);
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
  return handleRequest((r, a) => {
    const next = resetFlags(r);
    next.success = true;
    next.successCount += 1;
    return setRemoves(setMessage(next, a), a);
  })(state, action);
}


/**
 * Remove request state from redux
 * @param state
 * @param action
 * @returns {*}
 */
export function removeRequestState (state: ReduxRequestState, action: Object): ReduxRequestState {
  invariant(nonEmpty(action.id), 'request action missing id field');

  const id = action.id;
  const stateId = Symbol(id);

  if (Object.hasOwnProperty.call(state.data, id)) {
    const data = Object.assign({}, state.data);
    delete data[id];
    return { id: stateId, data };
  }
  return Object.assign({ id: stateId }, state);
}


/**
 * Replaces the whole request state with a new state
 *
 * @param state
 * @param action
 * @returns {*}
 */
export const replaceState = (state: ProviderRequestState, action: Object) => {
  const stateId = Symbol(REPLACE);

  return Object.assign({}, { data: action.state, id: stateId });
};


/**
 * Request state reducer for redux
 * @param state Initial state
 * @param action redux action dispatched
 * @returns {*} Final state
 */
export function rootReducer(state: ReduxRequestState, action: Object) {
  const oldState = Object.assign({}, initialState, state);
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

    case REPLACE:
      return replaceState(oldState, payload);

    case REMOVE:
      return removeRequestState(oldState, payload);

    default: {
      return oldState;
    }
  }
}

export default { [REQUEST_ACTION_TYPE]: rootReducer };
