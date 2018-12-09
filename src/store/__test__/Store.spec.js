import createRequestStore from '../Store';
import RequestSubscription from '../RequestSubscription';
import randomId from '../../utils/randomId';
import { initialRequest } from '../../utils/common';


describe('[Function] Store', () => {
  let initialState;
  let subscription;
  let store;

  const createStore = () => {
    store = createRequestStore(subscription, initialState)
  };

  beforeEach(() => {
    initialState = {
      id: Symbol(),
      data: {}
    };
    subscription = new RequestSubscription();
    createStore();
  });

  it('Should create a request store', () => {
    expects(store).to.have.all.keys([
      'getState', 'updateState', 'removeState', 'subscribe', 'getSubscription'
    ])
  });

  it('Should set an initial state for a newly created store', () => {
    expects(store.getState()).to.be.eql(initialState);
    const id = randomId();
    const state = {
      id: Symbol(),
      data: { [id]: { ...initialRequest, id } }
    };
    initialState = state;
    createStore();
    expects(store.getState()).to.be.eql(state);
  });

  it('Should provide a default state for a newly created store if initial state is not provided', () => {
    const newStore = createRequestStore(subscription);
    const state = newStore.getState();

    expects(state).to.not.be.empty();
    expects(state.id).to.be.a('symbol');
    expects(state.data).to.be.an('object')
  });

  it('Should throw if subscription is not provided as a first argument', () => {
    expects(() => createRequestStore()).to.throw(/Required: Store subscription not should not be empty/)
  });

  describe('[Function] getState', () => {
    it('Should be a function', () => {
      expects(store.getState).to.be.a('function')
    });

    it('Should get the frozen current state of store', () => {
      expects(store.getState()).to.be.frozen()
    });
  });

  describe('[Function] updateState', () => {
    it('Should be a function', () => {
      expects(store.updateState).to.be.a('function')
    });

    it('Should set the current state of a request state', () => {
      const id = randomId();
      const stateId = Symbol(id);
      const nextRequest = { ...initialRequest, id };
      store.getState();
      store.updateState(stateId, nextRequest);
      expects(store.getState().id).be.equal(stateId);
      expects(store.getState()).to.deep.include({ data: { [id]: nextRequest }})
    });

    it('Should notify subscribers after a request state update if state is changed', () => {
      const notify = jest.spyOn(subscription, 'notify');
      const id = randomId();
      const stateId = Symbol(id);
      const nextRequest = { ...initialRequest, id };

      store.updateState(stateId, nextRequest);
      expect(notify).toHaveBeenCalledTimes(1);
    });
  });


  describe('[Function] removeState', () => {
    it('Should be a function', () => {
      expects(store.removeState).to.be.a('function')
    });

    it('Should remove a request state from store', () => {
      const id = randomId();
      const stateId = Symbol(id);
      const nextRequest = { ...initialRequest, id };
      store.updateState(stateId, nextRequest);
      expects(store.getState().data[id]).be.eql(nextRequest);

      store.removeState(Symbol(id), id);
      expects(store.getState().data[id]).be.undefined();
      expects(store.getState().id).to.not.be.equal(stateId)
    });
    it('Should notify subscribers after a request state is removed', () => {
      const notify = jest.spyOn(subscription, 'notify');
      const id = randomId();
      const stateId = Symbol(id);
      const nextRequest = { ...initialRequest, id };

      store.updateState(stateId, nextRequest);
      expect(notify).toHaveBeenCalledTimes(1);

      store.removeState(Symbol(id), id);
      expect(notify).toHaveBeenCalledTimes(2);
    });
  });

  describe('[Function] subscribe', () => {
    it('Should be a function', () => {
      expects(store.subscribe).to.be.a('function')
    });

    it('Should add new subscribers to subscription via subscription proxy', () => {
      const subs = jest.spyOn(subscription, 'subscribe');
      store.subscribe(() => {});
      expect(subs).toHaveBeenCalledTimes(1)
    });
  });

  describe('[Function] getSubscription', () => {
    it('Should be a function', () => {
      expects(store.getSubscription).to.be.a('function');
    });

    it('Should return a subscription object', () => {
      const subs = store.getSubscription();
      expects(subs.subscribe).to.be.a('function');
      expects(subs.notify).to.be.a('function');
    });
  })
});
