// @flow
import arrayValuesOfKeys from '../utils/arrayValuesOfKeys';
import type { RequestId, ProviderRequestState, RequestState } from '../index';
import { initialRequest } from '../utils/common';
import isEmptyObj from '../utils/isEmptyObj';

/**
 * Select request states of a list of request ids provided
 * if no request is found for a particular id, a default request state is provided
 * If no id prop is provided, no default request is provided
 *
 * @private
 */
export default function getRequest(
  ids: Array<RequestId>,
  requestObj: ProviderRequestState
): ProviderRequestState {
  if (!Array.isArray(ids) || ids.length === 0) return {};

  if (isEmptyObj(requestObj)) {
    // Return a single request state instead of an object map of { [id]: requestState }
    if (ids.length === 1) {
      return Object.assign({}, initialRequest, { id: ids[0] });
    }

    const reduce = {};
    //  prefill all with initial request states
    for (let i = 0; i < ids.length; i += 1) {
      const id = ids[i];
      reduce[id] = Object.assign({}, initialRequest, { id })
    }
    return reduce;
  }

  //  extract all requestStates by ids
  const requests = arrayValuesOfKeys(requestObj, ids, (key, obj) => {
    if (Object.hasOwnProperty.call(obj, key)) return obj[key];

    return { ...initialRequest, id: key };
  });

  //  Return a single request state instead of an object map
  if (ids.length === 1) {
    return requests.find(r => r.id === ids[0]);
  }

  const reduce = {};
  for (let i = 0; i < requests.length; i += 1) {
    const r = requests[i];
    reduce[r.id] = r
  }
  return reduce;
}


/**
 * Selects a single request state by request id
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
