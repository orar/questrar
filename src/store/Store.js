// @flow
import invariant from 'invariant';
import type { RequestState, ProviderRequestState, RequestId } from '../index';
import RequestSubscription from './RequestSubscription';
import type { Subscriber, SubscriptionOptions } from './RequestSubscription';
import isFunc from '../utils/isFunc';

export type RequestStoreState = {
  id: Symbol,
  data: ProviderRequestState
}


export type RequestStore = {
  getState: () => RequestStoreState,
  updateState: (stateId: Symbol, request: RequestState) => void,
  removeState: (stateId: Symbol, id: RequestId) => void,
  subscribe: (subscriber: Subscriber, options?: SubscriptionOptions) => () => void,
  getSubscription: () => RequestSubscription
}

const defaultStoreState: RequestStoreState = {
  id: Symbol('default'),
  data: {}
};


export default function createRequestStore(
  subscriptionOps: RequestSubscription,
  initialState: RequestStoreState = defaultStoreState,
): RequestStore {
  invariant(
    subscriptionOps && isFunc(subscriptionOps.notify) && isFunc(subscriptionOps.subscribe),
    'Required: Store subscription not should not be empty'
  );
  const state = initialState;
  const subscription = subscriptionOps;

  function getState () {
    const currentState = Object.assign({}, state);
    return Object.freeze(currentState);
  }

  function updateState(stateId: Symbol, request: RequestState) {
    const { id } = request;
    const oldStateId = state.id;
    if (!id) return;

    state.data[id] = request;
    state.id = stateId;
    // Verify state change only with state id
    if (oldStateId !== stateId) {
      subscription.notify(state, id);
    }
  }

  function removeState (stateId: Symbol, id: RequestId) {
    const oldStateId = state.id;
    if (Object.hasOwnProperty.call(state.data, id)) {
      delete state.data[id];
      state.id = stateId;

      if (oldStateId !== stateId) {
        subscription.notify(state, id);
      }
    }
  }

  function subscribe(subscriber: Subscriber, options?: SubscriptionOptions) {
    return subscription.subscribe(subscriber, options);
  }

  function getSubscription () {
    return subscription;
  }

  return {
    getState,
    updateState,
    removeState,
    subscribe,
    getSubscription
  }
}
