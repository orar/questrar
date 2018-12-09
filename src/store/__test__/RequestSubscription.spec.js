import RequestSubscription from '../RequestSubscription';
import randomId from '../../utils/randomId';


describe('[Function] RequestSubscription', () => {
  let subscription;
  let initialSubscribers;
  let dummyListener;
  let options;
  const createSubscription = (init = false) => {
    subscription = init ? new RequestSubscription(initialSubscribers) : new RequestSubscription()
  };

  beforeEach(() => {
    options = {};
    dummyListener = () => {};
    initialSubscribers = [];
    createSubscription();
  });

  it('Should be a function', () => {
    expects(RequestSubscription).to.be.a('function');
  });

  it('Should provide an initial empty list of subscribers', () => {
    expects(subscription.subscribers).to.be.an('array').that.is.empty()
  });

  it('Should toggle `isSubscribed` flag if there are or not subscribers', () => {
    expects(subscription.subscribers).to.be.an('array').that.is.empty();
    expects(subscription.isSubscribed).to.be.false();

    const unsubscribe = subscription.subscribe(dummyListener);
    expects(subscription.subscribers).to.have.lengthOf(1);
    expects(subscription.isSubscribed).to.be.true();

    unsubscribe();
    expects(subscription.subscribers).to.be.empty();
    expects(subscription.isSubscribed).to.be.false();
  });

  it('Should set an initial set of subscribers upon construction', () => {
    initialSubscribers = [dummyListener];
    createSubscription(true);
    expects(subscription.subscribers).to.have.lengthOf(1);
    expects(subscription.isSubscribed).to.be.true();
  });

  it('Should get all subscribers', () => {
    initialSubscribers = [dummyListener];
    createSubscription(true);
    subscription.subscribe(() => {});
    expects(subscription.subscribers).to.have.lengthOf(2);
    expects(subscription.getSubscribers()).to.have.lengthOf(2);
  });

  it('Should clear all subscribers', () => {
    initialSubscribers = [dummyListener];
    createSubscription(true);
    subscription.subscribe(() => {});
    expects(subscription.subscribers).to.have.lengthOf(2);
    expects(subscription.getSubscribers()).to.have.lengthOf(2);

    subscription.clearAll();
    expects(subscription.subscribers).to.have.lengthOf(0);
    expects(subscription.getSubscribers()).to.have.lengthOf(0);
  });

  it('Should not subscribe a listener if listener is not a function', () => {
    const localListener = 32;
    const unsubscribe = subscription.subscribe(localListener);
    expects(subscription.subscribers).to.have.lengthOf(0);
    expects(unsubscribe).to.be.a('function')
  });

  it('Should subscribe a listener on call `subscribe`', () => {
    subscription.subscribe(dummyListener);
    expects(subscription.subscribers).to.have.lengthOf(1);
    expects(subscription.subscribers[0].subscriber).to.be.equal(dummyListener)
  });

  it('Should subscribe a listener to a set of request states', () => {
    const id = randomId();
    options.id = [id];
    subscription.subscribe(dummyListener, options);

    expects(subscription.subscribers).to.have.lengthOf(1);
    expects(subscription.subscribers[0].subscriber).to.be.equal(dummyListener);
    expects(subscription.subscribers[0].options).to.be.equal(options)
  });

  it('Should not notify any subscriber if `isSubscribed` is false', () => {
    dummyListener = jest.fn();
    subscription.subscribe(dummyListener);

    subscription.isSubscribed = false;
    subscription.notify({ id: 'any'});
    expect(dummyListener).not.toHaveBeenCalled();

    subscription.isSubscribed = true;
    const another = { id: 'another' };
    subscription.notify(another);
    expect(dummyListener).toHaveBeenNthCalledWith(1, another)
  });


  it('Should not notify a subscriber if not subscribed to a particular context id', () => {
    dummyListener = jest.fn();
    const localListener = jest.fn();

    const id = randomId();
    options.id = [id];

    subscription.subscribe(dummyListener, options);
    subscription.subscribe(localListener);
    expect(subscription.subscribers).toHaveLength(2)

    const state = { id: id };
    const state2 = { id: '2342'};

    subscription.notify(state, id);
    subscription.notify(state2, randomId());

    expect(dummyListener).toHaveBeenCalledWith(state);
    expect(dummyListener).not.toHaveBeenCalledWith(state2);

    expect(localListener).toHaveBeenCalledWith(state)
    expect(localListener).toHaveBeenCalledWith(state2)
  });

});
