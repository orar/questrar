

export type Request = {
  id?: string,

  pending: boolean,
  success: boolean | string,
  failed: boolean | string,

  successCount: number,
  failureCount: number,

  message?: any
}




export type ProviderRequestState = {
  [string]: Request
};

export type RequestActions = {
  success: (id: string, message?: any) => any,
  failed: (id: string, message?: any) => any,
  pending: (id: string, message?: any) => any,
  remove: (id: string, message?: any) => any,
};

export type RequestContext = {
  data: RequestState
  actions: RequestActions
}

export type RequestState = {
  request: {
    data: Request,
    actions: RequestActions
  }
}

type RequestSelectorProps = {
  request: Request,
  actions: RequestActions,
}