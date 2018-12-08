// @flow
import type { RequestState, CreateRequest, RequestId } from '../index';
import { SUCCESS, FAILED, PENDING, REMOVE, CLEAN, DIRTY } from '../utils/common';
import { REQUEST_ACTION_TYPE } from './common';
import nonEmpty from '../utils/nonEmpty'
import randomId from '../utils/randomId'
import isRequestId from '../utils/isRequestId'


/**
 * Creates a redux requestState action to update request state in redux store
 *
 * @param id
 * @returns {function(Object=, string=, RequestOptions=)}
 */
export function createRequest (id?: RequestId): CreateRequest {
  const reduxActionType = REQUEST_ACTION_TYPE;

  const requestId: RequestId = isRequestId(id) ? id : randomId();

  /**
   * Creates an FSA action to update a request in redux store
   * @param reqId Request id
   * @param status Update status of request
   * @param message Optional message for current update
   * @returns {{type: string, id: (string|number), status: string}}
   */
  const initAction = (reqId: RequestId, status: string, message?: any) => {
    const action = { type: reduxActionType };
    const payload = { id: reqId, status };
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
   * @returns FSA
   */
  const success = (message?: any) => initAction(requestId, SUCCESS, message);

  /**
   *
   * Creates a request failed action
   * @param message Optional message for update
   * @returns {{type: string, id: (string|number), status: string} & {autoRemove: boolean}}
   */
  const failed = (message?: any) => initAction(requestId, FAILED, message);

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
  function requestAction () {
    return requestId;
  }

  requestAction.id = requestId;

  requestAction.pending = pending;
  requestAction.success = success;
  requestAction.failed = failed;

  requestAction.clean = clean;
  requestAction.dirty = dirty;

  requestAction.remove = remove;

  return requestAction;
}


export default createRequest;
