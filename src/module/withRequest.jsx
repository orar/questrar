// @flow
import React from 'react';
import type {RequestContext, ProviderRequestState} from '../index';
import { initialRequest} from './common';
import { RequestConsumerContext } from './context';
import {arrayValuesOfKeys, isFunc, nonEmpty, isEmptyObj} from './helper';


type RequestComponentProps = {
  id: string | Array<string>,
}

type RequestComponentOptions = {
  id:string | Array<string> | (props: RequestComponentProps | any) => string | Array<string>,
  mergeIdSources: boolean,
}


/**
 * Provides request object to component wrapped in `withRequest`
 *
 * @param options Request options
 * @returns HOC Function
 */
export default function withRequest(options?: RequestComponentOptions) {
  return function withRequestHOC(WrappedComponent: any) {
    return class extends React.Component<RequestComponentProps> {
      props: RequestComponentProps;

      /**
       * Combine id from HOC and provided in props to array of request ids
       * @returns {Array} An array of request ids
       * @private
       */
      getIds = () => {
        let id = [];

        if (options) {
          //  options.id takes precedence over props.id
          if (options.id) {
            let idList = options.id;
            if (isFunc(options.id)) {
              idList = options.id(this.props);
            }
            const optId = Array.isArray(idList) ? idList : [idList];
            // $FlowFixMe
            id = id.concat(optId);
          }

          // combine props.id if mergeIdSources set true or options.id is empty
          const { id: pId } = this.props;
          if ((options.mergeIdSources || id.length === 0) && pId) {
            const propsId = Array.isArray(pId) ? pId : [pId];
            // $FlowFixMe
            id = id.concat(propsId);
          }
        }

        return id;
      };

      /**
       * Select requestState of an id provided in props
       * if no requestState is found for the particular id, a default requestState is provided
       *
       * @private
       */
      getRequest = (requestObj: ProviderRequestState) => {
        const ids = this.getIds();

        if (!Array.isArray(ids) || ids.length === 0) return {};

        if (isEmptyObj(requestObj)) {
          //  Return a single request state instead of an object map of id: requestState
          if (ids.length === 1) {
            return Object.assign({}, initialRequest, { id: ids[0] });
          }

          //  prefill all with initial request states
          return ids.reduce((acc, id) => {
            const iniReq = Object.assign({}, initialRequest, { id });
            return Object.assign({}, acc, { [id]: iniReq });
          }, {});
        }

        //  extract all requestStates by ids
        const requests = arrayValuesOfKeys(requestObj, ids, (k, o) => {
          if (Object.hasOwnProperty.call(o, k)) {
            return Object.assign({}, o[k], { id: k });
          }
          return Object.assign({}, initialRequest, { id: k });
        });

        //  Return a single request state instead of an object map
        if (ids.length === 1) {
          const req = requests.find(r => r.id === ids[0]);
          if (nonEmpty(req)) {
            return req;
          }
          // code never gonna reach here
          return Object.assign({}, initialRequest, { id: ids[0] });
        }

        return requests.reduce((acc, curReq) => {
          acc[curReq.id] = curReq;
          return acc;
        }, {});
      };


      /**
       * Renders Wrapped Component
       * @param state
       * @returns {*}
       */
      renderComponent = (state: RequestContext) => {
        const data = this.getRequest(state.data);
        const request = Object.assign({}, { data, actions: state.actions });

        return <WrappedComponent {...this.props} request={request} />;
      };


      render() {
        return (
          <RequestConsumerContext>
            {this.renderComponent}
          </RequestConsumerContext>
        );
      }
    }
  }
}
