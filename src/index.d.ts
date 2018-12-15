
//==========================================
// Flow types
//==========================================

export declare type  RequestId = string | number | symbol

export declare enum RequestStatus {
    PENDING, FAILED, SUCCESS, DIRTY, CLEAN, REMOVE
}

/**
 * Request state type of a single request
 */
export declare interface RequestState {
    id?: RequestId;
    $id: Symbol,

    pending: boolean;
    success: boolean;
    failed: boolean;

    successCount: number;
    failureCount: number;

    clean: boolean,

    message?: any;

}

/**
 * Request actions for turning request states
 */
export declare interface RequestActions {
    success (id: RequestId, message?: any): any;
    failed (id: RequestId, message?: any): any;
    pending (id: RequestId, message?: any): any;
    remove (id: RequestId, message?: any): any;

    clean (id: RequestId): any;
    dirty (id: RequestId): any;
}


export declare interface ProviderRequestState {
    [s: string]: RequestState
}


/**
 * Request object received by inject functions and props
 */
export declare interface RequestProp {
    data: RequestState;
    actions: RequestActions;
}

/**
 * Request object received by components wrapped with `withRequest` HOC
 */
export declare interface RequestMapProp {
    data: {[id: string]: RequestState };
    actions: RequestActions;
}


export declare interface StateProvider {
    name: string

    /**
     * Gets all of the request states in store
     * @returns {{}}
     */
    getState():any;

    /**
     * Updates a specific requestState in store
     * @param requestStatus
     * @returns {null}
     */
    updateRequest (requestStatus: { id: RequestId, messsage?: any, status: RequestStatus }): void

    /**
     * Observe changes to the request state and re-renders the RequestProvider tree subsequently
     */
    observe (updater: (shouldUpdate: boolean) => any): void

    /**
     * Releases all resources before unmounting RequestProvider (componentWillUnmount)
     */
    release (): void

}



// ===============
// redux
// ==============


export declare interface ReduxRequestState {
    id: Symbol,
    data: ProviderRequestState
}


export declare function createRequestState(id: RequestId): CreateRequest;



export declare interface CreateRequest {
    id: string | number,
    pending: (message?: any) => { type: string, payload: { id: RequestId, status: string, message?: any }}
    success: (message?: any, remove?: boolean) => { type: string, payload: { id: RequestId, status: string, message?: any }}
    failed: (message?: any, remove?: boolean) => { type: string, payload: { id: RequestId, status: string, message?: any }}
    remove: () => { type: string, payload: { id: RequestId, status: string }}
    dirty: () => { type: string, payload: { id: RequestId, status: string }}
    clean: () => { type: string, payload: { id: RequestId, status: string }}
}
