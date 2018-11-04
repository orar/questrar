// @flow
import React from 'react';
import type { Node } from 'react';
import { FAILED, initialRequest, PENDING, SUCCESS, REMOVE, CLEAN, DIRTY } from './common';
import { RequestProviderContext } from './context';
import { isFunc, nonEmpty, resetRequestFlags } from './helper';
import type { Request, ProviderRequestState, StateProvider } from '../index';


type Props = {
  children: Node | Array<Node>,
  stateProvider?: StateProvider
}

type State = {
  data: { [string]: Request },
}
/* eslint-disable react/destructuring-assignment */

/**
 * Provides request state via context to its sub component tree
 *
 * ```
 * const optionalStateProvider = createStateProvider(reduxStore);
 *
 * <RequestProvider stateProvider?={optionalStateProvider} >
 *   <App />
 * </RequestProvider
 *```
 */
class RequestProvider extends React.PureComponent<Props, State> {
    props: Props;

    state: State = { data: { } };


    /**
   * Observe updates from the external store and force a re-render of the component tree
   * Since changes to the requestState outside of RequestProvider does not effect state nor props,
   * a forced re-render is needed to apply changes to the component tree when there should be
   */
    componentDidMount() {
      const { stateProvider } = this.props;
      if (this.hasStore() && isFunc(stateProvider.observe)) {
        stateProvider.observe(this.updateContextTree);
      }
    }

    componentWillUnmount() {
      const { stateProvider } = this.props;
      if (this.hasStore()) {
        stateProvider.release();
      }
    }

  /**
   * Force update component tree
   * @param shouldUpdate
   */
  updateContextTree = (shouldUpdate: boolean) => {
    if (shouldUpdate) {
      this.forceUpdate();
    }
  };

  /**
   * Checks if provider has external request state store
   * @returns {boolean}
   * @private
   */
  hasStore = ():%checks => nonEmpty(this.props.stateProvider);

  /**
   * Gets requestState from provided store.
   * Instance using redux, store.getState() returns store state
   * @returns {*}
   * @private
   */
  getRequestStateFromProvider = () => {
    if (this.hasStore()) {
      return this.props.stateProvider.getState();
    }
    return {};
  };

  /**
   * Gets requestState from state if no store is provided
   * @private
   */
  getRequestStateFromState = () => Object.assign({}, this.state.data);


  /**
   * unified get request state from state/store
   * @returns {*}
   * @private
   */
  getRequestState = () => {
    if (this.hasStore()) {
      return this.getRequestStateFromProvider();
    }
    return this.getRequestStateFromState();
  };

  /**
   * Puts final request state to store
   * @param data
   * @returns {null}
   * @private
   */
  putRequestState = (data: ProviderRequestState) => {
    if (this.hasStore()) {
      return this.props.stateProvider.putState(data);
    }
    return this.setState({ data });
  };

  /**
   * Applies a transform to a request state
   * @param id
   * @returns {Function}
   * @private
   */
  applyStateChange = (id: string) => (transform: (req: Request) => Request) => {
    if (typeof transform !== 'function') return;

    const state = this.getRequestState();
    const exist = Object.hasOwnProperty.call(state, id);
    const request = exist ? state[id] : initialRequest;
    const req = resetRequestFlags(Object.assign({}, request));
    req.id = id;
    const tdata = transform(req);
    const data = Object.assign({}, state, { [id]: tdata });
    this.putRequestState(data)
  };

  /**
   * Updates a request to successful and increments the success count of the particular request
   * @param id Request Id
   * @param message An optional message for update
   * @private
   */
  requestSuccessful = (id: string, message?: any) => {
    if (this.hasStore()) {
      return this.props.stateProvider.updateRequest({ id, message, status: SUCCESS });
    }
    const updateSuccess = (r) => {
      const req = r;
      req.success = true;
      req.successCount += 1;

      if (message) {
        req.message = message;
      }
      return req;
    };
    return this.applyStateChange(id)(updateSuccess)
  };


  /**
   * Updates a request to failed and increments the failure count of the particular request
   * @param id Request Id
   * @param message An optional message for update
   * @private
   */
  requestFailed = (id: string, message?: any) => {
    if (this.hasStore()) {
      return this.props.stateProvider.updateRequest({ id, message, status: FAILED });
    }
    const updateFailed = (r) => {
      const req = r;
      req.failed = true;
      req.failureCount += 1;

      if (message) {
        req.message = message;
      }
      return req;
    };
    return this.applyStateChange(id)(updateFailed)
  };


  /**
   * Updates a request request to pending
   *
   * @param id Request id
   * @param message An optional message for the update. Example 'loading...'
   * @private
   */
  requestPending = (id: string, message?: any) => {
    if (this.hasStore()) {
      return this.props.stateProvider.updateRequest({ id, message, status: PENDING });
    }
    const updatePending = (r) => {
      const req = r;
      req.pending = true;
      req.clean = true;

      if (message) {
        req.message = message;
      }
      return req;
    };
    return this.applyStateChange(id)(updatePending)
  };

  /**
   * Set request to clean
   * @param id Request id
   * @private
   */
  requestClean = (id: string) => {
    if (this.hasStore()) {
      return this.props.stateProvider.updateRequest({ id, status: CLEAN });
    }
    const makeClean = (r) => {
      const req = r;
      req.clean = true;
      return req;
    };
    return this.applyStateChange(id)(makeClean);
  };

  /**
   * Set request to clean falsey
   * @param id Request id
   * @private
   */
  requestDirty = (id: string) => {
    if (this.hasStore()) {
      return this.props.stateProvider.updateRequest({ id, status: DIRTY });
    }
    const makeClean = (r) => {
      const req = r;
      req.clean = false;
      return req;
    };
    return this.applyStateChange(id)(makeClean)
  };

  /**
   * Removes request from request state
   *
   * @param id
   * @private
   */
  removeRequest = (id: string) => {
    if (this.hasStore()) {
      return this.props.stateProvider.updateRequest({ id, status: REMOVE });
    }
    const state = this.getRequestState();
    if (!Object.hasOwnProperty.call(state, id)) return null;

    const data = state;
    delete data[id];
    return this.putRequestState(data);
  };

  /**
   * Request actions to sync request updates
   * @returns {RequestActions}
   * @private
   */
  requestActions = () => ({
    success: this.requestSuccessful,
    failed: this.requestFailed,
    pending: this.requestPending,
    remove: this.removeRequest,
    clean: this.requestClean,
    dirty: this.requestDirty,
  });


  render() {
    const { children } = this.props;

    const data = this.getRequestState();
    const actions = this.requestActions();

    const context = { data, actions };

    return (
      <RequestProviderContext value={context}>
        { children }
      </RequestProviderContext>
    );
  }
}


export default RequestProvider;
