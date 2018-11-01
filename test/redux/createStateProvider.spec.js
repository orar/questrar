import configureStore from 'redux-mock-store'
import { randomId } from '../../src/module/helper';
import createStateProvider from '../../src/redux/createStateProvider';
import { REQUEST_ACTION_TYPE } from '../../src/redux/common';
import { SUCCESS } from '../../src/module/common';

describe('[createStateProvider]', () => {
  let id;
  let store;
  let mockStore;
  let stateProvider;

  const createStore = () => {
    mockStore = configureStore([]);
    store = mockStore({});
  };

  beforeEach(() => {
    id = randomId();
    createStore();
    stateProvider = createStateProvider(store);
  });


  it('should be a function', () => {
    expects(createStateProvider).to.be.a('function');
  });

  it('Should have the provider properties', () => {
    expects(stateProvider).to.be.an('object').that.has.all
      .keys(['getState', 'observe', 'path', 'release', 'updateRequest', 'putState']);
  });


  it('Should set arbitrary path of request states if provided', () => {
    const arbPath = 'new.state.path';
    stateProvider = createStateProvider(store, arbPath);
    /* eslint-disable prefer-template */
    const expectedPath = arbPath + '.' + REQUEST_ACTION_TYPE;
    expects(stateProvider.path).to.be.equal(expectedPath);
  });

  xit('Should subscribe to store onCall `observe`', () => {
    const observer = jest.fn();
    stateProvider.observe(observer);
    store.dispatch({ type: REQUEST_ACTION_TYPE });
    expect(observer).toHaveBeenCalledTimes(1);
  });

  // redux-mock-store doesnt support reducer logic
  xit('Should unsubscribe from store onCall `release`', () => {
    const observer = jest.fn();
    stateProvider.observe(observer);
    store.dispatch({ type: REQUEST_ACTION_TYPE });
    expect(observer).toHaveBeenCalledTimes(1);
    stateProvider.release();
    store.dispatch({ type: REQUEST_ACTION_TYPE });
    expect(observer).not.toHaveBeenCalled();
  });

  // redux-mock-store doesnt support reducer logic
  xit('Should update a requestState onCall `updateRequest`', () => {
    const dispatch = jest.spyOn(stateProvider, 'dispatch', 'setter');
    const action = { type: REQUEST_ACTION_TYPE, payload: { id, status: SUCCESS }};
    stateProvider.updateRequest(action);

    expect(dispatch).toBeCalledWith(action)
  });

  // redux-mock-store doesnt support reducer logic
  xit('Should replace whole state onCall `putState`', () => {

  });
});
