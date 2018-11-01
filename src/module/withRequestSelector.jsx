// @flow
import React from 'react';
import type { RequestContext, ProviderRequestState } from '../index';
import { initialRequest } from './common';
import { RequestConsumerContext } from './context';


type WrappedComponentProps = {
  id: string,
}


/**
 * HOC Wraps the Request component.
 * Select a request in the request tree using the request id provided to the Request component
 * @param WrappedComponent
 * @returns React$Node
 */
export default function withRequestSelector (WrappedComponent: any) {
  return class extends React.Component<WrappedComponentProps> {
    /* eslint-disable react/sort-comp */
    props: WrappedComponentProps;


    /**
     * Select request of an id provided in props
     * if no request is found for this particular id, a default request is provided
     *
     * @private
     */
    getRequest = (state: ProviderRequestState) => {
      const { id } = this.props;
      if (id && Object.hasOwnProperty.call(state, id)) {
        return Object.assign({}, state[id]);
      }
      return { ...initialRequest, id };
    };

    /**
     * Renders Wrapped Component
     * @param state
     * @returns {*}
     */
    renderComponent = (state: RequestContext) => {
      const request = this.getRequest(state.data);

      return <WrappedComponent {...this.props} actions={state.actions} request={request} />;
    };

    render() {
      return (
        <RequestConsumerContext>
          {this.renderComponent}
        </RequestConsumerContext>
      )
    }
  }
}
