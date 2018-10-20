
//==========================================
// Flow types
//==========================================


/**
 * Request state type of a single request
 */
export declare interface RequestState {
    id?: string;

    pending: boolean;
    success: boolean | string;
    failed: boolean | string;

    successCount: number;
    failureCount: number;

    message?: any;

    autoRemove?: boolean;
    removeOnSuccess?: boolean;
    removeOnFail?: boolean;
}

/**
 * Request actions for turning request states
 */
export declare interface RequestActions {
    success (id: string, message?: any): any;
    failed (id: string, message?: any): any;
    pending (id: string, message?: any): any;
    remove (id: string, message?: any): any;
}


export declare interface ProviderRequestState {
    [s: string]: RequestState
}



export declare interface RequestContext {
    data: { [s: string]: RequestState };
    actions: RequestActions
}


export declare interface RequestSelectorProps {
    request: RequestState;
    actions: RequestActions;
}

/**
 * Request object received by inject functions and props
 */
export declare interface RequestProp {
    data: RequestState;
    actions: RequestActions;
}


export declare interface StateProvider {

    /**
     * Gets all of the request states in store
     * @returns {{}}
     */
    getState():any;

    /**
     * Puts request state
     * Updates all of request states in store
     *
     * @param state
     * @returns {null}
     */
    putState (state: Object): void

    /**
     * Updates a specific requestState in store
     * @param requestStatus
     * @returns {null}
     */
    updateRequest (requestStatus: Object): void

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
