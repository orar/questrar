// @flow
import type {RequestState} from "../index";
import {SUCCESS, FAILED, PENDING, REMOVE, CLEAN, DIRTY} from "../module/common";
import { REQUEST_ACTION_TYPE } from './common';
import {isNumber, nonEmpty, randomId} from "../module/helper";


/**
 * Configuration type for request action
 */
export type RequestActionOptions = {
  modifier?: (payload: any) => any,
  autoRemove?: boolean,

  autoRemoveOnSuccess?: boolean,
  autoRemoveOnFailure?: boolean,
}

export type RequestOptions = {
  autoRemove: boolean,
  inject: (r: RequestState) => Object,
}


/**
 * Creates a redux requestState action to update request state in redux store
 *
 * @param id
 * @param options
 * @returns {function(Object=, string=, RequestOptions=)}
 */
export function createRequest (id?: string | number, options?: RequestActionOptions) {
  const reduxActionType = REQUEST_ACTION_TYPE;

  const isStatic = nonEmpty(id) && (typeof id === 'string' || isNumber(id));
  const hasOptions = nonEmpty(options);

  const autoRemove = hasOptions && options.autoRemove;
  const autoRemoveOnSuccess = hasOptions && options.autoRemoveOnSuccess;
  const autoRemoveOnFailure = hasOptions && options.autoRemoveOnFailure;

  const requestId = isStatic ? id : randomId();


  const initAction = (rId, status, message?) => {
    const _action = { type: reduxActionType, id: rId, status };
    if(nonEmpty(message)){
      _action.message = message
    }
    return _action;
  };


  const pending = ( message?: any) => {
    return initAction(requestId, PENDING, message);
  };

  const success = ( message?: any, remove?: boolean) => {
    const action = initAction(requestId, SUCCESS, message);
    if(nonEmpty(remove)){
      action.autoRemoveOnSuccess = remove
    } else {
      action.autoRemoveOnSuccess = autoRemoveOnFailure
    }
    return Object.assign(action, { autoRemove, autoRemoveOnSuccess })
  };

  const failed = ( message?: any, remove?: boolean) => {
    const action = initAction(requestId, FAILED, message);
    if(nonEmpty(remove)){
      action.autoRemoveOnFailure = remove
    } else {
      action.autoRemoveOnFailure = autoRemoveOnFailure
    }
    return Object.assign(action, { autoRemove })
  };

  /**
   * Update request as clean
   * @returns {{type: string, id: *, status: *}}
   */
  const clean = () => {
    return initAction(requestId, CLEAN);
  };

  /**
   * Make request dirty (clean === false)
   * @returns {{type: string, id: *, status: *}}
   */
  const dirty = () => {
    return initAction(requestId, DIRTY);
  };

  const remove = () => {
    return initAction(requestId, REMOVE);
  };

  function actionCreator () {
    return requestId;
  }

  actionCreator.toString = () => {
    return requestId;
  };

  actionCreator.id = requestId;

  actionCreator.pending = pending;
  actionCreator.success = success;
  actionCreator.failed = failed;

  actionCreator.clean = clean;
  actionCreator.dirty = dirty;

  actionCreator.remove = remove;

  return actionCreator;
}



export default createRequest;
