import configureStore from 'redux-mock-store'
import { randomId } from '../../module/helper';
import createStateProvider, { getRawState } from '../createStateProvider';
import { REQUEST_ACTION_TYPE } from '../common';
import {
  CLEAN,
  DIRTY,
  FAILED,
  initialRequest,
  PENDING,
  REMOVE,
  REPLACE,
  SUCCESS
} from '../../module/common';

describe('[createStateProvider]', () => {
  let id;
  let store;
  let mockStore;
  let stateProvider;
  let initialState;

  const createStore = () => {
    mockStore = configureStore([]);
    store = mockStore(initialState);
    stateProvider = createStateProvider(store);
  };

  beforeEach(() => {
    id = randomId();
    initialState = {};
    createStore();
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

  it('Should get state', () => {
    const id = randomId()
    const data = { [id]: { ...initialRequest, id} }
    initialState = { [REQUEST_ACTION_TYPE]: { id: Symbol(id), data }};
    createStore();

    expects(stateProvider.getState()).to.be.eql(data)
  });

  it('Should return an empty state if state doesnt exist or data is empty', () => {
    initialState = { [REQUEST_ACTION_TYPE]: { id: Symbol(id), data: {} }};
    createStore();
    expects(stateProvider.getState()).to.be.empty()

    initialState = { [REQUEST_ACTION_TYPE]: { }};
    createStore();
    expects(stateProvider.getState()).to.be.empty()
  });

 it('Should get request state deeply nested in a redux state', () => {
    const id = randomId();
    const path = 'x.y.z.' + REQUEST_ACTION_TYPE;
    const requestState = { [REQUEST_ACTION_TYPE]: { id: Symbol(id), data: { [id]: { ...initialRequest, id} }}};
    initialState = { x: { y: { z: requestState }}};

    createStore();
    expects(getRawState(store, path)).to.be.eql(requestState[REQUEST_ACTION_TYPE])
  });


 it('Should throw a path incorrect error if path to request state is incorrect', () => {
    const id = randomId();
    const path = 'x.y.v.' + REQUEST_ACTION_TYPE;
    const requestState = { [REQUEST_ACTION_TYPE]: { id: Symbol(id), data: { [id]: { ...initialRequest, id} }}};
    initialState = { x: { y: { z: requestState }}};

    createStore();
    expects(() => getRawState(store, path)).to.throw(/'v' does not exist/)
  });

 it('Should put replace state', () => {
   const newState = { [id]: { ...initialRequest, id}  };
   const expectedAction = { type: REPLACE, payload: newState };
   stateProvider.putState(newState);
   expects(store.getActions()[0]).to.be.eql(expectedAction)
 });

 it('Should subscribe to store', () => {
   const updateTree = () => true;
   jest.spyOn(store, 'subscribe')
   stateProvider.observe(updateTree);

   expect(store.subscribe).toHaveBeenCalledTimes(1)
 });

 it('Should unsubscribe to store on call `release`', () => {
   const updateTree = () => true;
   const unsubscribe = jest.fn()
   store.subscribe = jest.fn(unsubscribe)
   stateProvider.observe(updateTree);
   stateProvider.release();

   expect(unsubscribe).toHaveBeenCalledTimes(1)
 });


 describe('[Function] (updateRequest)', () => {
   let action;

   beforeEach(() => {
     action = { id }
   });

   it('Should dispatch a request pending action to store', () => {
     action.status = PENDING;
     action.message = 'im loading. Waiit!';

     stateProvider.updateRequest(action);
     const { payload } = store.getActions()[0];

     expects(payload).to.be.eql(action)
   });

   it('Should dispatch a request success action to store', () => {
     action.status = SUCCESS;
     action.message = 'success message'
     stateProvider.updateRequest(action);
     const { payload } = store.getActions()[0];

     expects(payload).to.be.eql(action)
   });

   it('Should dispatch a request failed action to store', () => {
     action.status = FAILED;
     action.message = 'oh no! total failure'
     stateProvider.updateRequest(action);
     const { payload } = store.getActions()[0];

     expects(payload).to.be.eql(action)
   });

   it('Should dispatch a remove request  action to store', () => {
     action.status = REMOVE;

     stateProvider.updateRequest(action);
     const { payload } = store.getActions()[0];

     expects(payload).to.be.eql(action)
   });

   it('Should dispatch a request dirty action to store', () => {
     action.status = DIRTY;

     stateProvider.updateRequest(action);
     const { payload } = store.getActions()[0];

     expects(payload).to.be.eql(action)
   });

   it('Should dispatch a request clean action to store', () => {
     action.status = CLEAN;

     stateProvider.updateRequest(action);
     const { payload } = store.getActions()[0];

     expects(payload).to.be.eql(action)
   });

   it('Should not dispatch any request action to store if action status is not provided', () => {
     stateProvider.updateRequest(action);

     expects(store.getActions()).to.be.empty()
   });



 });
});
