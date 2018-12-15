// @flow
import type { Node } from 'react';
import type { RequestState } from '../index';
import { RequestId } from '../index';

export type RequestsSubTreesCache = {
  requests: {[key: string|number]: RequestState },
  set: (request: Object, tree: Object) => void,
  has: (request:Object) => boolean,
  getTree: (request:RequestState) => any,
  cleanSelf: (request: Array<RequestState>) => void,
}

/**
 * Caches request children by their request ids for performance sake (Avoiding re-rendering)
 * @returns  {RequestsSubTreesCache}
 */
export default function createCache(): RequestsSubTreesCache {
  const map = new Map();

  return {
    requests: map,

    set: function setRequestWithTree(request, tree): void {
      const value = {
        $id: request.$id,
        tree
      };
      this.requests.set(request.id, value)
    },

    has: function isCached(request: RequestState): boolean {
      if (!this.requests.has(request.id)) return false;

      const value = this.requests.get(request.id);
      if (value.$id !== request.$id) {
        this.requests.delete(request.id);
        return false;
      }

      return true;
    },

    getTree: function requestWithTree(request: RequestState) {
      const value = this.requests.get(request.id);
      if (value) return value.tree;

      return null;
    },

    cleanSelf: function clean(states: Array<RequestId>): void {
      this.requests.forEach((_, key) => {
        if (!states[key]) {
          this.requests.delete(key);
        }
      });
    }
  }
}
