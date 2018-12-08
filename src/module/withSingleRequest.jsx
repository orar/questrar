// @flow
import React, { createElement } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import invariant from 'invariant';
import type { RequestId, StateProvider, RequestState } from '../index';
import RequestContext from './context';
import createRequestActions from './createRequestStateActions';
import isFunc from '../utils/isFunc';
import type { Bookkeeper } from './createRequestBookkeeper';
import createRequestBookkeeper from './createRequestBookkeeper';
import getComponentName from '../utils/getComponentName';
import requireReactComponent from '../utils/requireReactComponent';
import compareRequestsMismatch from '../utils/compareRequestsMismatch';
import { selectSingleRequestState } from './selectRequestStates';

type WrappedComponentProps = {
  id: RequestId,
  stateProvider: StateProvider,
  request: RequestState,
}

type State = {
  id: Symbol
}

/**
 * HOC Wraps the Request component.
 * Select a request in the request tree using the request id provided to the Request component
 * @param WrappedComponent
 * @returns React$Node
 */
export default function withSingleRequest (WrappedComponent: any) {
  requireReactComponent(WrappedComponent);

  class WithSingleRequest extends React.Component<WrappedComponentProps, State> {
    props: WrappedComponentProps;

    state: State;

    context: Object;

    bookkeeper: Bookkeeper;

    release: () => void;

    provider: StateProvider;


    constructor(props: WrappedComponentProps, context: StateProvider) {
      super(props, context);

      this.createProvider();
      this.createBookkeeper();
    }

    /**
     * Subscribe to provider state changes and
     * Check for provider state updates to refresh component
     */
    componentDidMount() {
      this.observe();
      this.bookkeeper.checkForUpdate(this.props.id);
      if (this.bookkeeper.shouldUpdate) this.forceUpdate();
    }

    /**
     * Decides a component re-render
     * @param nextProps
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps: WrappedComponentProps) {
      this.bookkeeper.checkForUpdate(this.props.id);
      return this.props !== nextProps || this.bookkeeper.shouldUpdate;
    }

    /**
     * Checks for props and provider updates before render
     * @param nextProps
     * @returns {boolean}
     */
    componentWillUpdate() {
      this.bookkeeper.checkForUpdate(this.props.id);
    }

    /**
     * Releases state provider subscriptions and clears bookkeeper history
     */
    componentWillUnmount() {
      this.bookkeeper.clearSelf();
      if (isFunc(this.release)) {
        this.release();
      }
    }

    /**
     * Observes provider state changes and set state to auto call for re-render.
     * Any re-render will be decided via `shouldComponentUpdate` by `bookkeeper`
     * to exclude unnecessary re-renders
     */
    observe = () => {
      const { id } = this.props;

      this.release = this.provider.observe((state) => {
        /* eslint-disable-next-line react/no-unused-state */
        this.setState({ id: state.id });
      }, { id: [id] });
    };

    /**
     * Initializes `bookkeeper`
     */
    createBookkeeper() {
      // $FlowFixMe
      this.bookkeeper = createRequestBookkeeper(
        this.provider,
        selectSingleRequestState,
        compareRequestsMismatch
      );
    }

    /**
     * Gets state provider by props precedence
     * @returns {*}
     */
    createProvider = () => {
      const { stateProvider } = this.props;
      if (stateProvider) {
        this.provider = stateProvider;
      } else {
        this.provider = this.context;
      }
      invariant(
        this.provider && isFunc(this.provider.getState),
        'No stateProvider is provided for request state storage. '
        + `This can be provided as a prop to ${getComponentName(WrappedComponent)} component `
        + 'or to Provider component'
      );
    };

    /**
     * Renders Wrapped Component
     * @returns {*}
     */
    render() {
      const data = this.bookkeeper.request;
      const actions = createRequestActions(this.provider);
      const request = { data, actions };
      const props = { ...this.props, request };
      return createElement(WrappedComponent, props)
    }
  }

  /* $FlowFixMe */
  WithSingleRequest.contextType = RequestContext;

  if (process.env.NODE_ENV !== 'production') {
    const wrappedComponentDisplayName = getComponentName(WrappedComponent);

    WithSingleRequest.displayName = `withSingleRequest(${wrappedComponentDisplayName})`
  }

  return hoistNonReactStatics(WithSingleRequest, WrappedComponent);
}
