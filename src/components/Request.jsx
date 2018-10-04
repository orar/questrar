// @flow
import React from 'react';
import type { Node } from 'react';
import type {Request, RequestActions, RequestProp} from "../QuestrarTypes";
import RequestError from "./RequestError/RequestError";
import RequestLoading from "./RequestLoading/RequestLoading";
import RequestSuccess from './RequestSuccess';
import withRequestSelector from '../module/withRequestSelector';
import {isFunc, isObj} from "../module/helper";
import invariant from 'invariant';

type Props = RequestActions & {
  id: string,

  renderInitial?: Node | (request: Request) => any,
  renderLoading?: Node | (request: Request) => any,
  passivePending?: boolean,
  initialLoading?: boolean,

  onError?: (request: Request) => any,
  renderError?: Node | (request: Request) => any,
  errorTooltip?: boolean,
  onCloseError?: () => any,

  onCloseSuccess?: () => any,
  successReplace?: boolean,
  successTooltip?: boolean,

  inject?: boolean | (request: RequestProp) => Object,
  append?: boolean,

  children: Array<Node> | Node,
}


/**
 * Renders a Request feedback in/around a component
 *
 * `renderLoading` and `renderInitial` differ.
 * `renderInitial` loading serves the purpose of rendering once a unique loading component to subsequent loading times
 * `renderLoading` is used when no `renderInitial` provided and also for all subsequent load
 * 
 * @param id             A request Id
 * @param request         A request state specified by the rId
 * @param actions         Actions to manage state of request
 *
 * @param children        The wrapped component
 * @param renderError     An optional error component that should be rendered if current request fails
 * @param renderLoading   An optional loading component that should be rendered whiles request is in flight
 * @param onError         An optional function that should be call with the request state(containing error)
 * @param initialLoading  if true, renders a loading component until request state is successful, even if request has not started.
 * @param renderInitial   An optional component that should be rendered coupled with initialLoading. When initialLoading is true and renderInitial is not provided, loading component falls back to renderLoading falls back to default LoadingComponent provided by Request
 * @param errorTooltip    If true, show error as a tooltip on the child component
 * @param onCloseError    A function that should be called when request error component is closed/unmounted
 * @param onCloseSuccess  A function that should be called when request success component is closed/unmounted
 * @param inject          If true, Inject component with request state and append request feedback components (tooltips, ..) instead of replacing component with feedback components
 * @param passivePending  If true, render children as loading element
 * @param successTooltip  Show a success description as a tooltip on the child component
 * @param successReplace  Replaces children with success component
 * @returns {*}
 * @constructor
 */
const RequestComponent = ({
                            id,
                            request,
                            actions,
                            children,

                            renderError,
                            errorTooltip,
                            onCloseError,
                            onError,

                            renderLoading,
                            passivePending,
                            initialLoading,
                            renderInitial,

                            successTooltip,
                            successReplace,
                            onCloseSuccess,

                            inject
                          }: Props) => {


  invariant(id !== null && id !== undefined, 'No request state id is provided as a prop');

  //if(id !== null && id !== undefined) return children;

  //Map generic request state actions to request id
  /*const mappedActions = {
    pending: (message?: any) => actions.pending(id, message),
    failed: (message?: any) => actions.failed(id, message),
    success: (message?: any) => actions.success(id, message),
  };*/

  const injection = { request: { data: request, actions }};

  //if request isPending, replace child with loading element
  if(request.pending && !passivePending){
    if (isFunc(renderLoading)) {
      return renderLoading(request)
    }
    if (renderLoading && isFunc(inject)) {
      const params = inject(injection);
      const paramProps = isObj(params) ? params : { request: params };
      // $FlowFixMe
      return React.cloneElement(renderLoading, paramProps);
    }

    if (renderLoading && inject ) { // $FlowFixMe
      return React.cloneElement(renderLoading, injection);
    }

    if(renderInitial){
      return renderInitial
    }

    return <RequestLoading />;
  }
  
  //if request isPending, keep child as loading element. Dont replace child.
  if(request.pending && passivePending) {
    const singleChild = React.Children.toArray(children).length === 1;

    //Inject element with request state and actions if it's single child
    if (singleChild && isFunc(inject) ) {
      // Render child but map request state to props
      // of error component through inject function provided
      const params = inject(injection);
      const paramProps = isObj(params) ? params : { request: params };
      //$FlowFixMe
      return React.cloneElement(children, paramProps);
    }
    if (singleChild && inject) {
      //Inject element if it's a child -- $FlowFixMe
      return React.cloneElement(children, injection);
    }
    return children;
  }

  //When request has failed
  if(request.failed) {
    //call onError callback
    if (isFunc(onError)) {
      onError(request)
    }
    //Render error
    if (isFunc(renderError)) {
      return renderError(request)
    }

    // Render custom error component but map request state to props
    // of error component through inject function
    if (renderError) {
      if (isFunc(inject)) {
        const params = inject(injection);
        const paramProps = isObj(params) ? params : { request: params };
        // $FlowFixMe
        return React.cloneElement(renderError, paramProps);
      }

      return inject ? React.cloneElement(renderError, request) : renderError;
    }


    return (
      <RequestError
        id={id}
        request={request}
        onCloseError={onCloseError}
        failure={request.failed}
        errorTooltip={errorTooltip}
        inject={inject}
        actions={actions}
      >
        {children}
      </RequestError>
    );
  }

  //Successful request
  if (request.success) {
    const singleChild = React.Children.toArray(children).length === 1;
    //Map requestState to child props via inject function
    if(singleChild &&isFunc(inject)){
      const params = inject(injection);
      const paramProps = isObj(params) ? params : { request: params };
      // $FlowFixMe
      return React.cloneElement(children, paramProps);
    }

    if(inject && singleChild){
      // $FlowFixMe
      return React.cloneElement(children, injection);
    }

    return (
      <RequestSuccess
        id={id}
        request={request}
        success={request.success}
        successReplace={successReplace}
        successTooltip={successTooltip}
        onCloseSuccess={onCloseSuccess}
        inject={inject}
        actions={actions}
      >
      {children}
    </RequestSuccess>
    )
  }

  // Until the request is successful, render a loading component
  // Usually used when if there is no data the underlying component may have rendering issues
  if(initialLoading) {

    if(isFunc(renderInitial)) {
      return renderInitial(injection)
    }

    if(!renderInitial && renderLoading) {
      if(isFunc(renderLoading)){
        return renderLoading(injection)
      }
      return renderLoading;
    }

    if(renderInitial){
      return renderInitial
    }

    return <RequestLoading />;
  }

  if (inject) {

    const singleChild = React.Children.toArray(children).length === 1;
    //Map requestState to child props via inject function
    if(singleChild && isFunc(inject)){
      const params = inject(injection);
      const paramProps = isObj(params) ? params : { request: params };
      // $FlowFixMe
      return React.cloneElement(children, paramProps);
    }

    if(singleChild){
      // $FlowFixMe
      return React.cloneElement(children, injection);
    }

  }

  //After everything falls through, return children
  return children;

};

export default withRequestSelector(RequestComponent);
