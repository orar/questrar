// @flow
import React, { PureComponent } from 'react';
import type {Request, ProviderRequestState} from "../index";
import type {Node} from "react";
import {FAILED, initialRequest, PENDING, SUCCESS, REMOVE} from './common';
import { RequestProviderContext } from "./context";
import {isFunc, nonEmpty, resetRequestFlags} from "./helper";
import type { StateProvider } from "../index";


type Props = {
  children: Node | Array<Node>,
  stateProvider?: StateProvider
}

type State = {
  data: { [string]: Request },
}


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
class RequestProvider extends PureComponent<Props, State> {
    props: Props;
    state: State = { data: { } };


  /**
   * Observe updates from the external store and force a re-render of the component tree
   * Since changes to the requestState outside of RequestProvider does not effect state nor props,
   * a forced re-render is needed to apply changes to the component tree when there should be
   */
  componentDidMount() {
    const { stateProvider  } = this.props;
    if (this._hasStore() && isFunc(stateProvider.observe)) {
      stateProvider.observe(shouldUpdate => {
        if (shouldUpdate) {
          this.forceUpdate();
        }
      });
    }
  }

  componentWillUnmount() {
    const { stateProvider  } = this.props;
    if (this._hasStore()) {
      stateProvider.release();
    }
  }

  /**
   * Checks if provider has external request state store
   * @returns {boolean}
   * @private
   */
  _hasStore = () => {
    return nonEmpty(this.props.stateProvider);
  };

  /**
   * Gets requestState from provided store.
   * Instance using redux, store.getState() returns store state
   * @returns {*}
   * @private
   */
  _getRequestStateFromProvider = () => {
    if(this._hasStore()) {
      return this.props.stateProvider.getState();
    }
    return {};
  };

  /**
   * Gets requestState from state if no store is provided
   * @private
   */
  _getRequestStateFromState = () => {
    return Object.assign({}, this.state.data);
  };


  /**
   * unified get request state from state/store
   * @returns {*}
   * @private
   */
  _getRequestState = () => {
    if(this._hasStore()) {
      return this._getRequestStateFromProvider();
    }
    return this._getRequestStateFromState();
  };

  /**
   * Puts final request state to store
   * @param data
   * @returns {null}
   * @private
   */
  _putRequestState = (data: ProviderRequestState) => {
    if(this._hasStore()) {
      return this.props.stateProvider.putState(data);
    }
    this.setState({ data });
  };

  /**
   * Applies a transform to a request state
   * @param id
   * @returns {Function}
   * @private
   */
  _applyStateChange = (id: string) => (transform: (req: Request) => Request) => {
    if (typeof transform !== "function") return;

    const state = this._getRequestState();
    const exist = Object.hasOwnProperty.call(state, id);
    const request = exist ? state[id] : initialRequest;
    const req = resetRequestFlags(Object.assign({}, request));
    req.id = id;
    const tdata = transform(req);
    const data = Object.assign({}, state, { [id]: tdata });
    this._putRequestState(data)
  };

  /**
   * Updates a request to successful and increments the success count of the particular request
   * @param id Request Id
   * @param message An optional message for update
   * @private
   */
  _requestSuccessful = (id: string, message?: any) => {
    if(this._hasStore()){
      return this.props.stateProvider.updateRequest({ id, message, status: SUCCESS });
    }
    const updateSuccess = r => {
      const req = r;
      req.success = true;
      req.successCount += 1;

      if(message){
        req.message = message;
      }
      return req;
    };
    this._applyStateChange(id)(updateSuccess)
  };


  /**
   * Updates a request to failed and increments the failure count of the particular request
   * @param id Request Id
   * @param message An optional message for update
   * @private
   */
  _requestFailed = (id: string, message?: any) => {
    if(this._hasStore()){
      return this.props.stateProvider.updateRequest({ id, message, status: FAILED });
    }
    const updateFailed = r => {
      const req = r;
      req.failed = true;
      req.failureCount += 1;

      if(message){
        req.message = message;
      }
      return req;
    };
    this._applyStateChange(id)(updateFailed)
  };


  /**
   * Updates a request request to pending
   *
   * @param id Request id
   * @param message An optional message for the update. Example 'loading...'
   * @private
   */
  _requestPending = (id: string, message?: any) => {
    if(this._hasStore()){
      return this.props.stateProvider.updateRequest({ id, message, status: PENDING });
    }
    const updatePending = r => {
      const req = r;
      req.pending = true;

      if(message){
        req.message = message;
      }
      return req;
    };
    this._applyStateChange(id)(updatePending)
  };


  /**
   * Removes request from request state
   *
   * @param id
   * @private
   */
  _removeRequest = (id: string) => {
    if(this._hasStore()){
      return this.props.stateProvider.updateRequest({ id, status: REMOVE });
    }
    const state = this._getRequestState();
    if(!Object.hasOwnProperty.call(state, id)) return;

    const data = state;
    delete data[id];
    this._putRequestState(data);
  };

  /**
   * Request actions to sync request updates
   * @returns {{success: RequestProvider._requestSuccessful, failed: RequestProvider._requestFailed, isPending: RequestProvider._requestPending}}
   * @private
   */
  _requestActions = () => {
    return {
      success: this._requestSuccessful,
      failed: this._requestFailed,
      pending: this._requestPending,
      remove: this._removeRequest
    };
  };


  render() {
    const { children } = this.props;

    const data = this._getRequestState();
    const actions = this._requestActions();

    const context = { data, actions };

    return (
      <RequestProviderContext value={context} >
        { children }
      </RequestProviderContext>
    );
  }
}


export default RequestProvider;
