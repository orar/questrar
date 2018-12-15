import configureStore from 'redux-mock-store'
import randomId  from '../../utils/randomId';
import createStateProvider, { getProviderState } from '../createStateProvider';
import { REQUEST_ACTION_TYPE } from '../common';
import {
  CLEAN,
  DIRTY,
  FAILED,
  initialRequest,
  PENDING,
  REMOVE,
  SUCCESS
} from '../../utils/common';

describe('[createStateProvider]', () => {
  let id;
  let idList;
  let store;
  let mockStore;
  let stateProvider;
  let initialState;
  let initialData;

  const createStore = () => {
    mockStore = configureStore([]);
    store = mockStore(initialState);
    stateProvider = createStateProvider(store);
  };

  const mockProviderState = () => {
    initialData = idList.reduce((acc, id) => {
      const req = { id, ...initialRequest };
      return {...acc, [id]: req };
    }, {});
    initialState ={ [REQUEST_ACTION_TYPE]: { id: Symbol(id), data: initialData }};
  };

  beforeEach(() => {
    idList = Array(10).fill(1).map(randomId);
    id = idList[0];
    mockProviderState();
    createStore();
  });


  it('should be a function', () => {
    expects(createStateProvider).to.be.a('function');
  });

  it('Should have the provider properties', () => {
    expects(stateProvider).to.be.an('object').that.has.all
      .keys(['name', 'getState', 'observe', 'updateRequest']);
  });

  it('Should get state', () => {
    expects(stateProvider.getState()).to.be.eql(initialData)
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
    expects(getProviderState(store, path, 'Test.State.Provider')).to.be.eql(requestState[REQUEST_ACTION_TYPE])
  });


 it('Should throw a path incorrect error if path to request state is incorrect', () => {
    const id = randomId();
    const path = 'x.y.v.' + REQUEST_ACTION_TYPE;
    const requestState = { [REQUEST_ACTION_TYPE]: { id: Symbol(id), data: { [id]: { ...initialRequest, id} }}};
    initialState = { x: { y: { z: requestState }}};

    createStore();
    expects(() => getProviderState(store, path, 'Test.State.Provider')).to.throw(/'v' does not exist/)
  });

 it('Should subscribe to store', () => {
   const updateTree = () => true;
   jest.spyOn(store, 'subscribe')
   stateProvider.observe(updateTree);

   expect(store.subscribe).toHaveBeenCalledTimes(1)
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
