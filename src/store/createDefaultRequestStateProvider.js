// @flow
import createStateProvider from './createStateProvider';
import RequestSubscription from './RequestSubscription';
import type { RequestStoreState } from '../index';
import createRequestStore from './Store';

export default function () {
  const initialState: RequestStoreState = {
    id: Symbol('default'),
    data: {}
  };

  const subscription = new RequestSubscription();
  const store = createRequestStore(subscription, initialState);

  return createStateProvider(store);
}
