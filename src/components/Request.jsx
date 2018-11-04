// @flow
import React from 'react';
import type { Node } from 'react';
import invariant from 'invariant';
import type { RequestState, RequestActions, RequestProp } from '../index';
import RequestError from './RequestError/RequestError';
import RequestPending from './RequestPending/RequestPending';
import RequestSuccess from './RequestSuccess';
import withRequestSelector from '../module/withRequestSelector';
import { isFunc, nonEmpty } from '../module/helper';
import { createChildren } from './Common';
import './Request.scss';


type Props = {
  id: string,
  request: RequestState,
  actions: RequestActions,
  renderPendOnMount?: Node | (request: RequestProp) => any,
  renderPending?: Node | (request: RequestProp) => any,
  passivePending?: boolean,
  pendOnMount?: boolean,

  onFailure?: (request: RequestState) => any,
  renderOnFail?: Node | (request: RequestState) => any,
  popoverOnFail?: boolean,
  passiveOnFail?: boolean,
  onCloseFailure?: () => any,

  onSuccess?: (request: RequestState) => any,
  onCloseSuccess?: () => any,
  successReplace?: boolean,
  popoverOnSuccess?: boolean,

  inject?: boolean | (request: RequestProp) => Object,

  children: Array<Node> | Node,
  className: string,
}

/* eslint-disable max-len */
/**
 * Renders a Request feedback in/around a component
 * TODO: Change error to fail
 *
 * `renderLoading` and `renderInitial` differ.
 * `renderInitial` loading serves the purpose of rendering once a unique loading component to subsequent loading times
 * `renderLoading` is used when no `renderInitial` provided and also for all subsequent load
 *
 * @param id                A request Id
 * @param request           A request state specified by the rId
 * @param actions           Actions to manage state of request
 *
 * @param renderLoading     An optional loading component that should be rendered whiles request is in flight
 * @param pendOnMount       If true, renders a loading component until request state is successful, even if request has not started.
 * @param renderPendOnMount   An optional component that should be rendered coupled with initialPending. When initialPending is true and renderInitial is not provided, loading component falls back to renderLoading falls back to default LoadingComponent provided by Request
 * @param passivePending    If true, render children as loading element
 *
 * @param renderOnFail      An optional error component that should be rendered if current request fails
 * @param onFailure         An optional function that should be call with the request state(containing error)
 * @param passiveOnFail     If true, render children on request state failure
 * @param popoverOnFail     If true, show error as a tooltip on the child component
 * @param onCloseFailure    A function that should be called when request error component is closed/unmounted

 * @param onSuccess         A function that should be called immediately when request successful
 * @param onCloseSuccess    A function that should be called when request success component is closed/unmounted
 * @param popoverOnSuccess  Show a success description as a tooltip on the child component
 * @param successReplace    Replaces children with success component
 *
 * @param children          The wrapped component
 * @param inject            If true, Inject component with request state and append request feedback components (tooltips, ..) instead of replacing component with feedback components
 * @param className         Class name of the popover body
 *
 * @returns {*}
 * @constructor
 */
export const Request = ({
  id,
  request,
  actions,
  children,

  inject,

  renderOnFail,
  popoverOnFail,
  onCloseFailure, // not full implemented
  onFailure,
  passiveOnFail,

  renderPending,
  passivePending,
  pendOnMount,
  renderPendOnMount,

  onSuccess,
  popoverOnSuccess,
  successReplace,
  onCloseSuccess,

  className,
}: Props) => {
  invariant(nonEmpty(id), 'No request state id is provided as a prop');

  const injection = { request: { data: request, actions } };

  if (request.pending) {
    // if request isPending, replace child with loading element
    if (!passivePending) {
      if (isFunc(renderPending)) {
        return renderPending(injection.request)
      }

      if (nonEmpty(renderPending)) {
        return createChildren({ children: renderPending, inject, request, actions })
      }

      return <RequestPending />;
    }

    // if request isPending, keep child as loading element. Dont replace child.
    return createChildren({ children, inject, request, actions });
  }

  // When request has failed
  if (request.failed) {
    // call onFailure callback
    if (isFunc(onFailure) && request.clean) {
      onFailure(injection.request);
      actions.dirty(id);
    }

    // Render custom error component but map request state to props
    // of error component through inject function
    if (nonEmpty(renderOnFail)) {
      if (isFunc(renderOnFail)) {
        return renderOnFail(injection.request)
      }
      return createChildren({ children: renderOnFail, inject, request, actions });
    }

    return (
      <RequestError
        id={id}
        request={request}
        onCloseFailure={onCloseFailure}
        popoverOnFail={popoverOnFail}
        inject={inject}
        actions={actions}
        passiveOnFail={passiveOnFail}
        className={className}
      >
        {children}
      </RequestError>
    );
  }

  // Successful request
  if (request.success) {
    // call onFailure callback
    if (isFunc(onSuccess) && request.clean) {
      onSuccess(injection.request);
      actions.dirty(request.id);
    }

    if (popoverOnSuccess || successReplace) {
      return (
        <RequestSuccess
          id={id}
          request={request}
          successReplace={successReplace}
          popoverOnSuccess={popoverOnSuccess}
          onCloseSuccess={onCloseSuccess}
          inject={inject}
          actions={actions}
          className={className}
        >
          {children}
        </RequestSuccess>
      );
    }

    return createChildren({ children, inject, request, actions });
  }

  // At default requestState, all flags (pending, success, failed) are false.
  // Until the requestState changes, render a loading component
  // Usually used when if there is no data the
  // underlying component may have rendering issues or even throw
  if (pendOnMount) {
    // `renderPendOnMount` is different from `renderPending`.
    // This is rendered once until any of the flags is set true.
    // That means `renderPendOnMount` is rendered once until requestState is reset
    if (renderPendOnMount) {
      if (isFunc(renderPendOnMount)) {
        return renderPendOnMount(injection.request)
      }
      return renderPendOnMount;
    }

    // If `renderPendOnMount` is not set, fallback to the custom `renderPending`
    if (renderPending) {
      if (isFunc(renderPending)) {
        return renderPending(injection.request)
      }
      return renderPending;
    }

    return <RequestPending />;
  }

  return createChildren({ children, inject, request, actions });
};

export default withRequestSelector(Request);
