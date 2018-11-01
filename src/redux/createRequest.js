// @flow
import type { RequestState, CreateRequestOptions, CreateRequest } from '../index';
import { SUCCESS, FAILED, PENDING, REMOVE, CLEAN, DIRTY } from '../module/common';
import { REQUEST_ACTION_TYPE } from './common';
import { isNumber, nonEmpty, randomId } from '../module/helper';


/**
 * Configuration type for request action
 * @experimental
 */
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
export function createRequest (
  id?: string | number,
  options?: CreateRequestOptions,
): CreateRequest {
  const reduxActionType = REQUEST_ACTION_TYPE;

  const isStatic = nonEmpty(id) && (typeof id === 'string' || isNumber(id));
  const hasOptions = nonEmpty(options);

  const autoRemove = hasOptions && options.autoRemove;
  const autoRemoveOnSuccess = hasOptions && options.autoRemoveOnSuccess;
  const autoRemoveOnFailure = hasOptions && options.autoRemoveOnFailure;

  // $FlowFixMe
  const requestId: string|number = isStatic ? id : randomId();


  /**
   * Creates an action to update a request in redux store
   * @param rId Request id
   * @param status Update status of request
   * @param message Optional message for current update
   * @returns {{type: string, id: (string|number), status: string}}
   */
  const initAction = (rId: string | number, status: string, message?: any) => {
    const action = { type: reduxActionType };
    const payload = { id: rId, status };
    if (nonEmpty(message)) {
      payload.message = message
    }
    action.payload = payload;
    return action;
  };


  /**
   * Creates a pending request action
   * @param message Optional message for update pending
   * @returns {{type: string, id: (string|number), status: string}}
   */
  const pending = (message?: any) => initAction(requestId, PENDING, message);


  /**
   * Creates a request successful action
   * @param message Optional message for update
   * @param remove Removes request on close success
   * @returns FSA
   */
  const success = (message?: any, remove?: boolean) => {
    const action = initAction(requestId, SUCCESS, message);
    const { payload } = action;
    if (nonEmpty(remove)) {
      payload.autoRemoveOnSuccess = remove
    } else if (autoRemoveOnSuccess || autoRemove) {
      payload.autoRemoveOnSuccess = true
    }

    return Object.assign({}, action, { payload })
  };

  /**
   *
   * Creates a request failed action
   * @param message Optional message for update
   * @param remove Removes request on close failure
   * @returns {{type: string, id: (string|number), status: string} & {autoRemove: boolean}}
   */
  const failed = (message?: any, remove?: boolean) => {
    const action = initAction(requestId, FAILED, message);
    const { payload } = action;
    if (nonEmpty(remove)) {
      payload.autoRemoveOnFailure = remove
    } else if (autoRemoveOnFailure || autoRemove) {
      payload.autoRemoveOnFailure = true
    }
    return Object.assign({}, action, { payload })
  };

  /**
   * Creates action to set request as clean
   * @returns {{type: string, id: *, status: *}}
   */
  const clean = () => initAction(requestId, CLEAN);

  /**
   * Creates action to set request as dirty (clean === false)
   * @returns {{type: string, id: *, status: *}}
   */
  const dirty = () => initAction(requestId, DIRTY);

  /**
   * Creates an action to remove a specific request state
   * @returns {{type: string, id: (string|number), status: string}}
   */
  const remove = () => initAction(requestId, REMOVE);

  /**
   * Action binder function
   * @returns {*}
   */
  function actionCreator () {
    return requestId;
  }

  actionCreator.toString = () => requestId;

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
