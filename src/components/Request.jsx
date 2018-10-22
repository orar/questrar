// @flow
import React from 'react';
import type { Node } from 'react';
import type { RequestState, RequestActions, RequestProp } from "../index";
import RequestError from "./RequestError/RequestError";
import RequestPending from "./RequestPending/RequestPending";
import RequestSuccess from './RequestSuccess';
import withRequestSelector from '../module/withRequestSelector';
import {isFunc, isObj} from "../module/helper";
import invariant from 'invariant';
import './Request.scss';

type Props = RequestActions & {
  id: string,
  request: RequestState,
  actions: RequestActions,
  renderInitial?: Node | (request: Request) => any,
  renderLoading?: Node | (request: Request) => any,
  passivePending?: boolean,
  initialPending?: boolean,

  onFailure?: (request: RequestState) => any,
  renderError?: Node | (request: RequestState) => any,
  failTooltip?: boolean,
  passiveOnFailure?: boolean,
  onCloseError?: () => any,

  onCloseSuccess?: () => any,
  successReplace?: boolean,
  successTooltip?: boolean,

  inject?: boolean | (request: RequestProp) => Object,
  append?: boolean,

  children: Array<Node> | Node,
  color: string,
  className: string,
}


/**
 * Renders a Request feedback in/around a component
 * TODO: Change error to fail
 *
 * `renderLoading` and `renderInitial` differ.
 * `renderInitial` loading serves the purpose of rendering once a unique loading component to subsequent loading times
 * `renderLoading` is used when no `renderInitial` provided and also for all subsequent load
 *
 * @param id             A request Id
 * @param request         A request state specified by the rId
 * @param actions         Actions to manage state of request
 *
 * @param renderLoading   An optional loading component that should be rendered whiles request is in flight
 * @param initialPending  if true, renders a loading component until request state is successful, even if request has not started.
 * @param renderInitial   An optional component that should be rendered coupled with initialPending. When initialPending is true and renderInitial is not provided, loading component falls back to renderLoading falls back to default LoadingComponent provided by Request
 * @param passivePending  If true, render children as loading element
 *
 * @param renderFailure     An optional error component that should be rendered if current request fails
 * @param onFailure         An optional function that should be call with the request state(containing error)
 * @param passiveOnFailure    If true, render children on request state failure
 * @param failTooltip    If true, show error as a tooltip on the child component
 * @param onCloseFailure    A function that should be called when request error component is closed/unmounted

 * @param onCloseSuccess  A function that should be called when request success component is closed/unmounted
 * @param successTooltip  Show a success description as a tooltip on the child component
 * @param successReplace  Replaces children with success component
 *
 * @param children        The wrapped component
 * @param inject          If true, Inject component with request state and append request feedback components (tooltips, ..) instead of replacing component with feedback components
 * @param color                 Color of font text and icon
 *
 * @returns {*}
 * @constructor
 */
const RequestComponent = ({
                            id,
                            request,
                            actions,
                            children,
                            inject,

                            renderFailure,
                            failTooltip,
                            onCloseFailure, //not full implemented
                            onFailure,
                            passiveOnFailure,

                            renderLoading,
                            passivePending,
                            initialPending,
                            renderInitial,

                            successTooltip,
                            successReplace,
                            onCloseSuccess,

                            color,
                            className
                          }: Props) => {


  invariant(id !== null && id !== undefined, 'No request state id is provided as a prop');

  const injection = { request: { data: request, actions }};

  //if request isPending, replace child with loading element
  if(request.pending && !passivePending){
    if (isFunc(renderLoading)) {
      return renderLoading(request)
    }
    if (renderLoading && isFunc(inject)) {
      const params = inject(injection.request);
      const paramProps = isObj(params) ? params : { request: params };
      // $FlowFixMe
      return React.cloneElement(renderLoading, paramProps);
    }

    if (renderLoading && inject ) { // $FlowFixMe
      return React.cloneElement(renderLoading, injection);
    }

    if(React.isValidElement(renderLoading)){
      return renderLoading
    }

    return <RequestPending color={color} />;
  }

  //if request isPending, keep child as loading element. Dont replace child.
  if(request.pending && passivePending) {
    const singleChild = React.Children.count(children) === 1;

    //Inject element with request state and actions if it's single child
    if (singleChild && isFunc(inject) ) {
      // Render child but map request state to props
      // of error component through inject function provided
      const params = inject(injection.request);
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

  // When request has failed
  if(request.failed) {
    //call onFailure callback
    if (isFunc(onFailure)) {
      onFailure(request)
    }
    //Render error
    if (isFunc(renderFailure)) {
      return renderFailure(request)
    }

    // Render custom error component but map request state to props
    // of error component through inject function
    if (React.isValidElement(renderFailure)) {
      if (isFunc(inject)) {
        const params = inject(injection.request);
        const paramProps = isObj(params) ? params : { request: params };
        // $FlowFixMe
        return React.cloneElement(renderFailure, paramProps);
      }

      return inject ? React.cloneElement(renderFailure, request) : renderFailure;
    }


    return (
      <RequestError
        id={id}
        request={request}
        onCloseError={onCloseFailure}
        failure={request.failed}
        errorTooltip={failTooltip}
        inject={inject}
        actions={actions}
        passiveOnError={passiveOnFailure}
        className={className}
      >
        {children}
      </RequestError>
    );
  }

  //Successful request
  if (request.success) {

    if(successTooltip || successReplace){
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
          className={className}
        >
          {children}
        </RequestSuccess>
      );
    }

    const singleChild = React.Children.count(children) === 1;
    //Map requestState to child props via inject function
    if(singleChild && isFunc(inject)){
      const params = inject(injection.request);
      const paramProps = isObj(params) ? params : { request: params };
      // $FlowFixMe
      return React.cloneElement(children, paramProps);
    }

    if(inject && singleChild){
      // $FlowFixMe
      return React.cloneElement(children, injection);
    }

    return children;
  }

  // Until the request is successful, render a loading component
  // Usually used when if there is no data the underlying component may have rendering issues
  if(initialPending) {

    if(isFunc(renderInitial)) {
      return renderInitial(injection)
    }

    if(!renderInitial && renderLoading) {
      if(isFunc(renderLoading)){
        return renderLoading(injection)
      }
      return renderLoading;
    }

    if(React.isValidElement(renderInitial)){
      return renderInitial
    }

    return <RequestPending color={color} />;
  }

  if (inject) {

    const singleChild = React.Children.toArray(children).length === 1;
    //Map requestState to child props via inject function
    if(singleChild && isFunc(inject)){
      const params = inject(injection.request);
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
