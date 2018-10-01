// @flow
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import isEmpty from 'lodash/isEmpty';
import type {RequestState} from "../../src/QuestrarTypes";
import { REQUEST_ACTION_TYPE, SUCCESS, FAILED, PENDING } from "../../src/module/common";
import {randomId} from "../../src/module/helper";


/**
 * Configuration type for request action
 */
export type RequestActionOptions = {
    modifier: (payload: any) => any,
    autoDelete: boolean,

    autoDeleteOnSuccess: boolean,
    autoDeleteOnFailure: boolean,
}

export type RequestOptions = {
    autoDelete: boolean,
    inject: (r: RequestState) => Object,
}


/**
 * Todo: Listen to redux events from inside action or add requestActionId
 * @param type
 * @param options
 * @returns {function(Object=, string=, RequestOptions=)}
 */
const createRequest = (type?: string, options?: RequestActionOptions) => {
    const reduxActionType = REQUEST_ACTION_TYPE;

    const isStaticType = !isNull(type) && (typeof type === 'string' || typeof type === 'number');
    const hasOptions = !isEmpty(options);
    const isAutoDelete = hasOptions && !isNull(options.autoDelete) && !isUndefined(options.autoDelete) ? options.autoDelete : false;

    const requestId = isStaticType ? type : randomId();
    const autoDelete = isStaticType ? isAutoDelete : true;

    const pending = ( message: any) => {
        const action = { type: reduxActionType,  id: requestId, status: PENDING };

        if(typeof message !== 'undefined' && message !== null){
            action.message = message
        }

        return action;
    };

    const success = ( message?: any) => {
        const action = { type: reduxActionType, id: requestId, status: SUCCESS };
        if(typeof message !== 'undefined' && message !== null){
            action.message = message
        }

        return action;
    };

    const failed = ( message?: any) => {
        const action = { type: reduxActionType, id: requestId, status: FAILED};

        if(typeof message !== 'undefined' && message !== null){
            action.message = message
        }

        return action;
    };

    //change to function prototype
    function actionCreator (/*payload?: Object, requestOptions?: RequestOptions*/) {
        /*const action = { type: requestId };
        if(autoDelete){
            action.autoDelete = autoDelete;
        }
        if(typeof payload !== 'undefined' ) {
            action.payload = payload;
        }

        if(!isEmpty(requestOptions)){
            action.requestOptions = requestOptions;
        }
        */

        return requestId;
    }

    actionCreator.toString = () => {
        return requestId;
    };

    actionCreator.pending = pending;
    actionCreator.success = success;
    actionCreator.failed = failed;
    actionCreator.id = requestId;

    return actionCreator;
};



export default createRequest;