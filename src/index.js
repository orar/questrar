// @flow

import Request from './components/Request';
import RequestProvider from './module/RequestProvider'
import withRequest from './module/withRequest';

const Provider = RequestProvider;


export { Request, Provider, withRequest }


//==========================================
// Flow types
//==========================================

export type RequestState = {
  id?: string,

  pending: boolean,
  success: boolean | string,
  failed: boolean | string,

  successCount: number,
  failureCount: number,

  message?: any,

  autoRemove?: boolean,
  removeOnSuccess?: boolean,
  removeOnFail?: boolean,
}


export type ProviderRequestState = {
  [string]: RequestState
};

export type RequestActions = {
  success: (id: string, message?: any) => any,
  failed: (id: string, message?: any) => any,
  pending: (id: string, message?: any) => any,
  remove: (id: string, message?: any) => any,
};

export type RequestContext = {
  data: { [string]: RequestState },
  actions: RequestActions
}


type RequestSelectorProps = {
  request: RequestState,
  actions: RequestActions,
}