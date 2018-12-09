// @flow
import type { RequestId, StateProvider, ProviderRequestState, RequestState } from '../index';

export type Bookkeeper = {
  checkForUpdate: (id: Array<RequestId>) => void,
  request: RequestState,
  shouldUpdate: boolean,
  clearSelf: () => void,
}

/**
 * WithRequest and WithSingleRequest HOC needs to track updates between
 * re-renders to decide a re-render.
 * For this to be possible some bookkeeping needs to be done to ensure accuracy.
 * @private
 */
export default function createRequestBookkeeper (
  provider: StateProvider,
  requestSelector: (id: Array<RequestId> | RequestId, ProviderRequestState) => Object,
  compareMismatch: (current: Object, next: Object) => boolean
) {
  const bookkeeper = {
    request: {},
    checkForUpdate: function checkRequestUpdate(ids: Array<RequestId>) {
      const state = provider.getState();
      const nextRequest = requestSelector(ids, state);
      this.shouldUpdate = compareMismatch(this.request, nextRequest);

      if (this.shouldUpdate) {
        this.request = nextRequest;
      }
    },
    clearSelf: function clearBookkeeperProps() {
      this.checkForUpdate = () => {};
      this.shouldUpdate = false;
      this.request = {};
    }
  };

  return bookkeeper;
}
