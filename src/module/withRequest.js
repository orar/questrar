// @flow
import React from "react";
import type {RequestContext, ProviderRequestState} from "../QuestrarTypes";
import isEmpty from "lodash/isEmpty";
import { initialRequest} from "./common";
import { RequestConsumerContext } from "./context";
import {arrayValuesOfKeys} from "./helper";


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
 * @returns {function(): {new(): {props: WrappedComponentProps, _getRequest, context: RequestContext, render(): *}, prototype: {props: WrappedComponentProps, _getRequest, context: RequestContext, render(): *}}}
 */
export default function withRequest(options?: RequestComponentOptions) {
  return function withRequestHOC(WrappedComponent: Node) {
    return class extends React.Component<RequestComponentProps> {
      props: RequestComponentProps;

      /**
       * Combine id from HOC and provided in props to array of request ids
       * @returns {Array} An array of request ids
       * @private
       */
      _getIds = () => {
        let id = [];

        if(options) {
          //options.id takes precedence over props.id
          if (typeof options.id === "function") {
            const _id = options.id(this.props);
            if(_id) {
              const __id = Array.isArray(_id) ? _id : [_id];
              id = id.concat(__id);
            }

          } else if (options.id) {
            const _id = Array.isArray(options.id) ? options.id : [options.id];
            id = id.concat(_id);
          }

          if((options.mergeIdSources || id.length === 0) && this.props.id) {
            const _id = Array.isArray(this.props.id) ? this.props.id : [this.props.id];
            id = id.concat(_id);
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
      _getRequest = (requestObj: ProviderRequestState) => {
        const ids = this._getIds();

        if (!Array.isArray(ids) || ids.length === 0) return {};

        if (isEmpty(requestObj)) {

          //Return a single request state instead of an object map
          if (ids.length === 1) {
            return Object.assign({}, initialRequest, { id: ids[0] });
          }

          //prefill all with initial request
          return ids.reduce((acc, id) => {
            const iniReq = Object.assign({}, initialRequest, { id: id });
            return Object.assign({}, acc, {[id]: iniReq});
          }, {});
        }

        const requests = arrayValuesOfKeys(requestObj, ids, (k, o) => {
          if (Object.hasOwnProperty.call(o, k)) {
            return Object.assign({}, o[k], {id: k});
          }
          return Object.assign({}, initialRequest, {id: k});
        });

        //Return a single request state instead of an object map
        if (ids.length === 1) {
          const _req = requests.find(r => r.id === ids[0]);
          console.log(requests);
          if(_req){
            return Object.assign({}, _req, { id: ids[0] });
          }
        }

        return requests.reduce((acc, req) => {
          acc[req.id] = req;
          return acc;
        }, {});
      };


      /**
       * Renders Wrapped Component
       * @param state
       * @returns {*}
       */
      renderComponent = (state: RequestContext) => {
        const data = this._getRequest(state.data);
        const request = Object.assign({}, { data: data, actions: state.actions });

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