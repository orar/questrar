// @flow
import arrayValuesOfKeys from './arrayValuesOfKeys';
import type { RequestId, ProviderRequestState, RequestState } from '../index';
import { initialRequest } from './common';
import isEmptyObj from './isEmptyObj';

/**
 * Select request states of a list of request ids provided
 * if no request is found for a particular id, a default request state is provided
 * If no id prop is provided, no default request is provided
 *
 * @private
 */
export function selectRequestStates(
  ids: Array<RequestId>,
  requestObj: ProviderRequestState,
): ProviderRequestState {
  if (!Array.isArray(ids) || ids.length === 0) return {};

  if (isEmptyObj(requestObj)) {
    const reduce = {};
    //  prefill all with initial request states
    for (let i = 0; i < ids.length; i += 1) {
      const id = ids[i];
      reduce[id] = Object.assign({}, initialRequest, { id })
    }
    return reduce;
  }

  //  extract all requestStates as Array<RequestState> by ids
  const requests = arrayValuesOfKeys(requestObj, ids, (key, obj) => {
    if (Object.hasOwnProperty.call(obj, key)) return obj[key];

    return { ...initialRequest, id: key };
  });

  const reduce = {};
  for (let i = 0; i < requests.length; i += 1) {
    const r = requests[i];
    reduce[r.id] = r
  }
  return reduce;
}


/**
 * Selects a single request state by request id from provider state
 * @param id Request id
 * @param requestStates Provider request states map
 * @returns {*}
 */
export function selectSingleRequestState(
  id: RequestId,
  requestStates: ProviderRequestState = {}
): RequestState {
  if (id && Object.hasOwnProperty.call(requestStates, id)) {
    return requestStates[id];
  }
  return { ...initialRequest, id }
}
