
//==========================================
// Flow types
//==========================================



export class RequestState {
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


export interface ProviderRequestState {
    [s: string]: RequestState
}

export interface RequestActions {
    success (id: string, message?: any): any;
    failed (id: string, message?: any): any;
    pending (id: string, message?: any): any;
    remove (id: string, message?: any): any;
}

export class RequestContext {
    data: { [s: string]: RequestState };
    actions: RequestActions
}


export class RequestSelectorProps {
    request: RequestState;
    actions: RequestActions;
}

export interface RequestProps {
    data: RequestState;
    actions: RequestActions;
}


export interface StateProvider {

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

}