import createStateProvider from '../createStateProvider';
import RequestSubscription from '../RequestSubscription';
import createRequestStore from '../Store';
import randomId from '../../utils/randomId';
import { CLEAN, DIRTY, FAILED, initialRequest, PENDING, REMOVE, SUCCESS } from '../../utils/common';

describe('[Function] createStateProvider', () => {
  let provider;
  let store;
  let subscription;

  const createProvider = () => {
    provider = createStateProvider(store)
  };

  beforeEach(() => {
    subscription = new RequestSubscription();
    store = createRequestStore(subscription);
    createProvider();
  });


  it('Should be a function', () => {
    expects(createStateProvider).to.be.a('function');
  });

  it('Should throw if request store is not provided', () => {
    expects(() => createStateProvider()).to.throw()
  });

  it('Should create new stateProvider on called', () => {
    const provider2 = createStateProvider(store);
    expects(provider).to.not.eql(provider2);
  });

  it('Should create static frozen stateProvider', () => {
    expects(provider).to.be.frozen();
  });

  it('Should have a name', () => {
    expects(provider).to.have.property('name').that.is.a('string')
  });

  it('Should get state of store on call `getState` method', () => {
    const state = provider.getState();
    expects(state).to.be.eql(store.getState().data);
  });

  describe('[Function] observe', () => {
    it('Should observe state changes in request store', () => {
      const observer = jest.fn();
      provider.observe(observer);
      const id = randomId();
      const state = { id, ...initialRequest };
      const stateId = Symbol(id);
      store.updateState(stateId, state);

      expect(observer).toHaveBeenNthCalledWith(1, store.getState());
    })
  });

  describe('[Function] updateRequest', () => {
    const getRequest = (id) => {
      const state = provider.getState();
      return state[id];
    };

    let id;
    let message;
    let action;


    beforeEach(() => {
      id = randomId();
      message = "what say i say?";
      action = { id, message };
    });

    it('Should update a request state to success', () => {
      action.status = SUCCESS;
      provider.updateRequest(action);
      const request = getRequest(id);

      expects(request.id).to.be.equal(id);
      expects(request.success).to.be.true();
      expects(request.successCount).to.be.equal(1);
    });


    it('Should update a request state to failed', () => {
      action.status = FAILED;
      provider.updateRequest(action);
      const request = getRequest(id);
      expects(request.id).to.be.equal(id);
      expects(request.failed).to.be.true();
      expects(request.failureCount).to.be.equal(1);
    });

    it('Should update a request state to pending', () => {
      action.status = PENDING;
      provider.updateRequest(action);
      const request = getRequest(id);
      expects(request.id).to.be.equal(id);
      expects(request.pending).to.be.true();
      expects(request.message).to.be.equal(message);
    });

    it('Should update a request state to dirty', () => {
      action.status = DIRTY;
      provider.updateRequest(action);
      const request = getRequest(id);
      expects(request.id).to.be.equal(id);
      expects(request.clean).to.be.false();
      expects(request.message).to.be.undefined();
    });

    it('Should update a request state to clean', () => {
      action.status = CLEAN;
      provider.updateRequest(action);
      const request = getRequest(id);
      expects(request.id).to.be.equal(id);
      expects(request.clean).to.be.true();
      expects(request.message).to.be.undefined();
    });

    it('Should remove a request state from store', () => {
      action.status = FAILED;
      provider.updateRequest(action);
      const request = getRequest(id);
      expects(request.id).to.be.equal(id);

      action.status = REMOVE;
      provider.updateRequest(action);
      const removed = getRequest(id);
      expects(removed).to.be.undefined();
    });

    it('Should warn on unknown request status update', () => {
      action.status = 'unknown';
      const error = jest.spyOn(console, 'error');

      provider.updateRequest(action);
      const request = getRequest(id);
      expect(request).toBeUndefined();
      expect(error).toHaveBeenCalledTimes(1)
    });

  });
});
