// @flow
import {PENDING, SUCCESS, FAILED, REPLACE, initialRequest, REMOVE} from "../module/common";
import type { ProviderRequestState } from "../index";
import { REQUEST_ACTION_TYPE } from './common';
import { nonEmpty, resetRequestFlags as resetFlags} from "../module/helper";
import invariant from 'invariant';

/**
 * Sets remove flags on request.
 * Removes control removal of requestState on close of RequestComponent feature `onCloseError` or `onCloseSuccess`
 * @param state
 * @param action
 * @returns {*}
 */
export function setRemoves(state, action) {
  const s = state;

  if (action.autoRemove) {
    s.autoRemove = true
  }
  if(action.autoRemoveOnSuccess){
    s.removeOnSuccess = true;
    if(s.autoRemove) {
      delete s['autoRemove'];
    }
    return s;
  }

  if(action.autoRemoveOnFailure){
    s.removeOnFail = true;
    if(s.autoRemove) {
      delete s['autoRemove'];
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
export function getState(state, id) {
  if (Object.hasOwnProperty.call(state, id)) {
    return Object.assign({}, state[id]);
  }
  return initialRequest;
}


/**
 * Set request state message if provided as part of action
 * @param state
 * @param action
 */
export function setMessage(state, action) {
  if(action.message){
    state.message = action.message;
  }
}

/**
 * Updates a request to pending
 *
 * @returns {{} & RequestState}
 */
export function handleRequestPending (state, action) {
  invariant(nonEmpty(action.id), 'request action missing id field');

  const id = action.id;

  const nextReq = resetFlags(getState(state, id));
  nextReq.id = id;
  nextReq.pending = true;
  setMessage(nextReq, action);

  return Object.assign({}, state, { [id]: nextReq });
}



/**
 * Updates a request state to failed
 * @params state, action
 * @returns {{} & RequestState}
 */
export function handleRequestFailed (state, action){
  invariant(nonEmpty(action.id), 'request state action missing id field');

  const id = action.id;

  const nextReq = resetFlags(getState(state, id));
  nextReq.id = id;
  nextReq.failed = true;
  nextReq.failureCount += 1;
  setMessage(nextReq, action);
  setRemoves(nextReq, action);

  return Object.assign({}, state, { [id]: nextReq });
}

/**
 * Updates a request state to success.
 * Autodeletes a request if set to true
 *
 * @params state, action
 * @returns {{} & RequestState}
 */
export function handleRequestSuccess (state, action) {
  invariant(nonEmpty(action.id), 'request state action missing id field');

  const id = action.id;

  const nextReq = resetFlags(getState(state, id));
  nextReq.id = id;
  nextReq.success = true;
  nextReq.successCount += 1;
  setMessage(nextReq, action);
  setRemoves(nextReq, action);

  return Object.assign({}, state, { [id]: nextReq });
}


/**
 * Remove request state from redux
 * @param state
 * @param action
 * @returns {*}
 */
export function removeRequestState (state, action) {
  invariant(nonEmpty(action.id), 'request action missing id field');

  const id = action.id;

  if (Object.hasOwnProperty.call(state, id)) {
    const _state = Object.assign({}, state);
    delete _state[id];
    return _state;
  }
  return Object.assign({}, state);
}


/**
 * Replaces the whole request state with a new state
 *
 * @param state
 * @param action
 * @returns {*}
 */
export const replaceState = (state: ProviderRequestState, action) => {
  return Object.assign({}, action.state);
};


/**
 * Request state reducer for redux
 * @param state Initial state
 * @param action redux action dispatched
 * @returns {*} Final state
 */
export function rootReducer(state: Object, action: Object) {
  const _state = Object.assign({}, state);
  switch (action.status){
    case PENDING:
      return handleRequestPending(_state, action);

    case SUCCESS:
      return handleRequestSuccess(_state, action);

    case FAILED:
      return handleRequestFailed(_state, action);

    case REPLACE:
      return replaceState(_state, action);

    case REMOVE:
      return removeRequestState(_state, action);

    default:{
      return _state;
    }
  }
}

export default { [REQUEST_ACTION_TYPE]: rootReducer };