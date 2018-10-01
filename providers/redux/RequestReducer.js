// @flow
import {PENDING, SUCCESS, FAILED, REQUEST_ACTION_TYPE, REPLACE, initialRequest} from "../../src/module/common";
import type { ProviderRequestState } from "../../src/QuestrarTypes";
import {isFunc, resetRequestFlags as resetFlags} from "../../src/module/helper";
import type {ReducerMap, Store} from "redux";
import isEmpty from "lodash/isEmpty";
import invariant from 'invariant';

/**
 * Inject request state reducers into store provided by user
 *
 * @param store User app redux store
 * @param reducer
 */
export function injectReducers (store: Store, reducer: Object) {
  invariant(!isEmpty(store), "Redux store not provided");
  invariant(!isEmpty(reducer.key), "Redux reducer key not provided");
  invariant(isFunc(reducer.reducer), "Redux reducer function not provided");


  const s = store;

  if(!Object.hasOwnProperty.call(store, 'asyncReducers')){
    store.asyncReducers = {};
  }

  if(Object.hasOwnProperty.call(store.asyncReducers, reducer.key)) return s;

  store.asyncReducers[reducer.key] = reducer.reducer;
  store.replaceReducer(s.asyncReducers[reducer.key]);

  //return s;
}

/**
 * Replaces the whole request state with a new state
 *
 * @param state
 * @param action
 * @returns {*}
 */
const replaceState = (state: ProviderRequestState, action) => {
  return Object.assign({}, action.state);
};

/**
 * Updates a request to pending
 * @param state
 * @param action
 * @returns {{} & RequestState}
 */
function handleRequestPending () {
  invariant(arguments !== 0, 'Provide state and action as arguments, handleRequestFailed(state, action)');
  const state = arguments[0];
  const action = arguments.length > 1 ? arguments[1] : {};
  invariant(action !== null && action !== undefined, 'reducer action missing id field');

  const { id, message } = action;

  const exist = Object.hasOwnProperty.call(state, id);
  const req = exist ? state[id] : initialRequest;
 
  const nextReq = resetFlags(req);
  nextReq.id = id;
  nextReq.pending = true;
  if(message){
    nextReq.message = message;
  }

  return Object.assign({}, state, { [id]: nextReq });
}


/**
 * Updates a request state to failed
 * @params state, action
 * @returns {{} & RequestState}
 */
function handleRequestFailed (){
  invariant(arguments !== 0, 'Provide state and action as arguments, handleRequestFailed(state, action)');
  const state = arguments[0];
  const action = arguments.length > 1 ? arguments[1] : {};
  invariant(action !== null && action !== undefined, 'reducer action missing id field');

  const { id, message, autoDelete } = action;

  if(autoDelete) {
    const nextState = Object.assign({}, state);
    delete nextState[id];
    return nextState;
  }

  const idExist = Object.hasOwnProperty.call(state, id);
  const req = idExist ? state[id] : initialRequest;
 
  const nextReq = resetFlags(req);
  nextReq.id = id;
  nextReq.failed = true;
  nextReq.failureCount += 1;
  if(message){
    nextReq.message = message;
  }

  return Object.assign({}, state, { [id]: nextReq });
}

/**
 * Updates a request state to success.
 * Autodeletes a request if set to true
 * @params state, action
 * @returns {{} & RequestState}
 */
function handleRequestSuccess (){
  invariant(arguments !== 0, 'Provide state and action as arguments, handleRequestFailed(state, action)');
  const state = arguments[0];
  const action = arguments.length > 1 ? arguments[1] : {};
  invariant(action !== null && action !== undefined, 'reducer action missing id field');

  const id = action.id;

  if(action.autoDelete) {
    const nextState = Object.assign({}, state);
    delete nextState[id];
    return nextState;
  }

  const idExist = Object.hasOwnProperty.call(state, id);
  const req = idExist ? state[id] : initialRequest;
 
  const nextReq = resetFlags(req);
  nextReq.id = id;
  nextReq.success = true;
  nextReq.successCount += 1;
  if(action.message){
    nextReq.message = action.message;
  }

  return Object.assign({}, state, { [id]: nextReq });
}


/**
 * Request state reducer for redux
 * @param state Initial state
 * @param action redux action dispatched
 * @returns {*} Final state
 */
export default (state: Object, action: Object) => {
  const _state = Object.assign({}, state);
  switch (action.status){
    case PENDING: {
      return handleRequestPending(_state, action);
    }
    case SUCCESS: {
      return handleRequestSuccess(_state, action);
    }

    case FAILED: {
      return handleRequestFailed(_state, action);
    }
    case REPLACE: {
      return replaceState(_state, action);
    }
    default:{
      return _state;
    }
  }
};
