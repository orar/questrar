// @flow
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import invariant from 'invariant';
import type { StateProvider, RequestId } from '../index';
import RequestContext from './context';
import createRequestActions from './createRequestStateActions';
import isFunc from '../utils/isFunc';
import type { Bookkeeper } from './createRequestBookkeeper';
import createRequestBookkeeper from './createRequestBookkeeper';
import getComponentName from '../utils/getComponentName';
import requireReactComponent from '../utils/requireReactComponent';
import { selectRequestStates } from '../utils/selectRequestStates';
import { compareMultiRequestMismatch } from '../utils/compareRequestsMismatch';
import isRequestId from '../utils/isRequestId';

type RequestComponentProps = {
  id?: RequestId | Array<RequestId>,
  stateProvider: StateProvider,
}

type State = {
  id: Symbol
}

type RequestComponentOptions = {
  /* eslint-disable-next-line max-len */
  id?: RequestId | Array<RequestId> | (props: RequestComponentProps | Object) => RequestId | Array<RequestId>,
  mergeIdSources?: boolean,
  stateProvider?: StateProvider,
  keepSingleRequestMap?: boolean,
}

/**
 * Provides request object to component wrapped in `withRequest`
 *
 * @param options Request options
 * @returns HOC Function
 */
export default function withRequest(options?: RequestComponentOptions = { }) {
  return function withRequestHOC(WrappedComponent: Object) {
    requireReactComponent(WrappedComponent);

    class WithRequest extends React.Component<RequestComponentProps, State> {
      props: RequestComponentProps;

      state: State;

      release: () => void;

      bookkeeper: Bookkeeper;

      provider: StateProvider;

      constructor(props, context) {
        super(props, context);

        this.createProvider();
        this.createBookkeeper();
      }


      componentWillMount() {
        const ids = this.getIds(this.props);
        this.bookkeeper.checkForUpdate(ids);
      }

      /**
       * Subscribe to provider state changes and
       * Check for provider state updates to refresh component
       */
      componentDidMount() {
        this.observe();
        if (this.bookkeeper.shouldUpdate) this.forceUpdate()
      }

      /**
       * Checks for props and provider updates before deciding a component re-render
       * @param nextProps
       * @returns {boolean}
       */
      shouldComponentUpdate(nextProps: RequestComponentProps) {
        const ids = this.getIds(nextProps);
        this.bookkeeper.checkForUpdate(ids);
        return this.props !== nextProps || this.bookkeeper.shouldUpdate;
      }

      /**
       * Checks for props and provider updates before render
       * @param nextProps
       * @returns {boolean}
       */
      componentWillUpdate(nextProps) {
        const ids = this.getIds(nextProps);
        this.bookkeeper.checkForUpdate(ids);
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
       * Initializes `bookkeeper`
       */
      createBookkeeper () {
        // $FlowFixMe
        this.bookkeeper = createRequestBookkeeper(
          this.provider,
          selectRequestStates,
          compareMultiRequestMismatch
        );
      }

      /**
       * Observes request states and causes re-render when any of them changes
       * Any re-render will be decided by `bookkeeper` to exclude unnecessary re-renders
       */
      observe = () => {
        /* eslint-disable-next-line react/no-unused-state */
        this.release = this.provider.observe(({ id }) => this.setState({ id }))
      };

      /**
       * Gets state provider by props precedence over options over context
       * @returns {*}
       */
      createProvider = () => {
        const { stateProvider } = this.props;
        if (stateProvider) {
          this.provider = stateProvider;
        } else if (options.stateProvider) {
          this.provider = options.stateProvider;
        } else {
          this.provider = this.context;
        }

        invariant(
          this.provider && isFunc(this.provider.getState),
          'No stateProvider is provided for request state storage. '
          + 'This can be provided as a stateProvider prop to the base Provider component '
          + `or to ${getComponentName(WrappedComponent)} component`
        );
      };

      /**
       * Combine id (from props with precedence over options) to array of request ids
       * @returns {Array} An array of request ids
       * @private
       */
      getIds = (props: RequestComponentProps): Array<RequestId> => {
        let idList = [];
        const { id } = props;
        const propsIdList = Array.isArray(id) ? id : [id];
        idList = idList.concat(propsIdList).filter(Boolean);

        if (idList.length === 0 || options.mergeIdSources) {
          if (isFunc(options.id)) {
            idList = idList.concat(options.id(props));
          } else if (options.id) {
            idList = idList.concat(options.id);
          }
        }
        return idList.filter(isRequestId);
      };

      /**
       * Renders Wrapped Component
       *
       * @returns {*}
       */
      render() {
        let data = this.bookkeeper.request;

        if (!options.keepSingleRequestMap) {
          const keys = Object.keys(data);
          if (keys.length === 1) {
            data = data[keys[0]]
          }
        }
        const actions = createRequestActions(this.provider);
        const request = { data, actions };
        const props = { ...this.props, request };

        return React.createElement(WrappedComponent, props)
      }
    }

    // $FlowFixMe
    WithRequest.defaultProps = {
      id: (props: Object) => (props ? props.id : null),
    };

    // $FlowFixMe
    WithRequest.contextType = RequestContext;

    if (process.env.NODE_ENV !== 'production') {
      const wrappedComponentDisplayName = getComponentName(WrappedComponent);
      WithRequest.displayName = `withRequest(${wrappedComponentDisplayName})`
    }

    return hoistNonReactStatics(WithRequest, WrappedComponent);
  }
}
