// @flow
import type { RequestStoreState, RequestId } from '../index';
import isFunc from '../utils/isFunc';
import warn from '../utils/warn';


export type Subscriber = (state: RequestStoreState) => void

export type SubscriptionOptions = {
  id?: Array<RequestId>
}

export type Subscription = {
  subscriber: Subscriber,
  options: SubscriptionOptions
}

const dummyUnsubscribe = () => {};

export default class RequestSubscription {
  subscribers: Array<Subscription>;

  isSubscribed: boolean;

  constructor(
    subscriptions: Array<Subscription> = [],
  ) {
    this.subscribers = subscriptions;
    this.isSubscribed = Boolean(subscriptions.length)
  }

  getSubscribers () {
    return this.subscribers.slice();
  }

  clearAll () {
    this.subscribers = [];
  }

  /**
   * Adds a subscriber to a subscription list
   * @param subscriber Subscriber function
   * @param options Subscription options
   * @returns {unsubscribe}
   */
  subscribe(subscriber: Subscriber, options?: SubscriptionOptions = {}) {
    if (!isFunc(subscriber)) {
      warn(
        `Expected subscriber to be a function instead of ${typeof subscriber} ${subscriber.toString()}`
      );
      return dummyUnsubscribe;
    }

    const subscription = { subscriber, options };
    this.subscribers.push(subscription);
    this.isSubscribed = true;
    const self = this;

    return function unsubscribe() {
      if (self.isSubscribed) {
        self.subscribers = self.subscribers.filter(l => l.subscriber !== subscriber);
        if (!self.subscribers.length) {
          self.isSubscribed = false
        }
      }
    }
  }

  /**
   * Notifies all subscribers in these scenarios:
   * Consider requestId param as event topic.
   *
   * 1. Subscriber A subscribes with no requestId subscription
   *
   * 2. Subscriber B subscribes with requestId (221) (subscribed to a particular request id)
   *
   *  For a state X (generic event with no topic (requestId))
   *    A will be notified of X because it's subscribed to all generic events
   *    B will be notified of X because it's subscribed to all generic events
   *  For a state Y with requestId 221
   *    A will be notified of Y because it's subscribed to no requestId
   *    B will be notified of Y because it's subscribed to requestId 221
   *  For a state Z with requestId 232,
   *    A will be notified of Z because it's subscribed to no requestId
   *    B will not be notified because Z is limited to those subscribing to no requestId or 232
   *
   * That is B is notified of event with no requestId or event with its requestId
   *
   * @param state
   * @param requestId
   */
  notify (state: RequestStoreState, requestId?: RequestId): void {
    if (!this.isSubscribed) return;

    const listeners = this.subscribers.slice();

    for (let i = 0; i < listeners.length; i += 1) {
      const sub = listeners[i];
      if (requestId && Array.isArray(sub.options.id)) {
        const subsOptId = sub.options.id;

        if (subsOptId.includes(requestId)) {
          sub.subscriber(state);
        }
      } else {
        sub.subscriber(state);
      }
    }
  }

  /*
  async notifyAsync (state: RequestStoreState, context?: RequestId) {
    this.activeSubscribers = this.subscribers;
    const listeners = Array.from(this.subscribers);

    const runPromise = new Promise(() => {
      for (let i = 0; i < listeners.length; i += 1) {
        const sub = listeners[i];
        if (context && sub.options.id) {
          const subsOptId = sub.options.id;
          const contextList = Array.isArray(subsOptId) ? subsOptId : [subsOptId];

          if (contextList.includes(context)) {
            sub.subscriber(state);
          }
        } else {
          sub.subscriber(state);
        }
      }
    });

    return runPromise;
  }
  */
}
