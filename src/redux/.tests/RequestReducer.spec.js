import { randomId } from '../../module/helper';
import {
  initialState,
  rootReducer,
  removeRequestState,
  handleRequestSuccess,
  handleRequestFailed,
  handleRequestPending,
  replaceState,
  setMessage,
  getState,
  setRemoves,
  handleRequestClean,
  handleRequestDirty,
} from '../RequestReducer';
import {
  CLEAN,
  DIRTY,
  FAILED,
  initialRequest,
  PENDING,
  REMOVE, REPLACE,
  SUCCESS,
} from '../../module/common';
import { REQUEST_ACTION_TYPE } from '../common';


describe('[RequestReducer]', () => {
  let idList;
  let id;
  let requestState;
  let action;
  let providerStateMock;

  const mockProviderState = () => {
    const data = idList.reduce((acc, rid) => {
      const req = Object.assign({ id: rid }, initialRequest);
      return Object.assign({}, acc, { [rid]: req });
    }, {});
    providerStateMock = { data }
  };

  beforeEach(() => {
    idList = Array(3).fill(1).map(randomId);

    id = idList[0];
    requestState = Object.assign({ id }, initialRequest);
    action = { type: REQUEST_ACTION_TYPE, payload: { id } };

    mockProviderState();
  });


  it('#setRemoves should set the proper flag for request state auto removal on success', () => {
    action.payload.autoRemove = true;
    action.payload.autoRemoveOnSuccess = true;
    const rm = setRemoves(requestState, action.payload);

    expects(rm).to.be.a('object').that.include({ id });
    expects(rm.autoRemove).to.be.undefined();
    expects(rm.removeOnSuccess).to.be.true();
  });


  it('#setRemoves should set the proper flag for request state auto removal on failure', () => {
    action.payload.autoRemove = true;
    action.payload.autoRemoveOnFailure = true;
    const rm = setRemoves(requestState, action.payload);

    expects(rm).to.be.a('object').that.include({ id });
    expects(rm.autoRemove).to.be.undefined();
    expects(rm.removeOnFail).to.be.true();
  });


  it('#setMessage should set message on a request state', () => {
    action.payload.message = 'New happy message';
    setMessage(requestState, action.payload);

    expects(requestState).to.be.an('object').that.includes({ message: action.payload.message });
  });


  it('#getState should get a particular request state from whole state', () => {
    const state = getState(providerStateMock.data, id);

    expects(state.id).to.be.equal(id);
  });

  it('#getState should substitute a not found request state with default', () => {
    const strangeId = 'strangeId';
    const state = getState(providerStateMock.data, strangeId);

    expects(state.id).to.equal(strangeId);
  });

  it('#handleRequestPending should immutably handle a request `pending` action', () => {
    const states = handleRequestPending(providerStateMock, action.payload);
    const states1 = handleRequestPending(providerStateMock, action.payload);
    const req = getState(states.data, action.payload.id);

    expects(req).to.be.an('object').that.deep.includes({
      id, failed: false, success: false, pending: true,
    });
    expects(states).not.eql(states1)
  });


  it('#handleRequestSuccess should immutably handle a  request action `success`', () => {
    action.payload.message = 'Request successful';
    const states = handleRequestSuccess(providerStateMock, action.payload);
    const states1 = handleRequestSuccess(providerStateMock, action.payload);
    const req = getState(states.data, action.payload.id);
    expects(req).to.be.an('object').that.deep.includes({
      id, failed: false, success: true, pending: false, message: action.payload.message,
    });
    expects(req.successCount).to.be.equal(1);
    expects(states).not.eql(states1)
  });

  it('#handleRequestFailed should immutably handle a request action `failed`', () => {
    action.payload.message = 'Sorry, request failed';
    const states = handleRequestFailed(providerStateMock, action.payload);
    const states1 = handleRequestFailed(providerStateMock, action.payload);
    const req = getState(states.data, action.payload.id);

    expects(req).to.be.an('object').that.deep.includes({
      id, failed: true, success: false, pending: false, message: action.payload.message,
    });
    expects(req.failureCount).to.be.equal(1);
    expects(states).not.eql(states1)
  });

  it('#removeRequestState should immutably remove a request state completely', () => {
    const states = removeRequestState(providerStateMock, action.payload);
    const states1 = removeRequestState(providerStateMock, action.payload);

    expects(Object.hasOwnProperty.call(states.data, id)).to.be.false();
    expects(states).not.eql(states1)
  });

  it('#removeRequestState should immutably reassign requestStates' +
    ' if no request is found to remove', () => {
    action.payload.id = "unknownId";
    const states = removeRequestState(providerStateMock, action.payload);
    const states1 = removeRequestState(providerStateMock, action.payload);

    expects(Object.hasOwnProperty.call(states.data, action.payload.id)).to.be.false();
    expects(states).to.not.eql(states1)
  });


  it('#handleRequestClean should only immutably set a request state as `clean`', () => {
    const dirty = handleRequestDirty(providerStateMock, action.payload);
    const old = getState(dirty.data,  action.payload.id);
    const states = handleRequestClean(dirty, action.payload);
    const states1 = handleRequestClean(dirty, action.payload);
    const req = getState(states.data, id);

    expects(req).to.be.an('object').that.includes({ id, clean: true });
    expects({ ...req, clean: false}).to.be.eql(old)
    expects(states).not.eql(states1)
  });

  it('#handleRequestDirty should only immutably set a request state as not `clean`', () => {
    const old = getState(providerStateMock.data,  action.payload.id);
    const states = handleRequestDirty(providerStateMock, action.payload);
    const states1 = handleRequestDirty(providerStateMock, action.payload);
    const req = getState(states.data, id);

    expects(req).to.be.an('object').that.includes({ id, clean: false });
    expects({ ...req, clean: true }).to.be.eql(old);
    expects(states).not.eql(states1)
  });

  it('#replaceState should replace old state with new given', () => {
    const replaced = replaceState({}, { state: providerStateMock.data })

    expects(replaced.data).to.be.eql(providerStateMock.data);
  });

  it('#rootReducer should return initial state on an undefined action', () => {
    const s = rootReducer();
    expects(s).to.be.eql(initialState)
  });

  it('#rootReducer should immutably reduce a success action on state', () => {
    action.payload.status = SUCCESS;
    action.payload.message = 'New happy message';

    const s = rootReducer(providerStateMock, action);
    const s1 = rootReducer(providerStateMock, action);
    const req = getState(s.data, action.payload.id);

    expects(req).to.be.an('object').that.deep.includes({
      id, failed: false, success: true, pending: false, message: action.payload.message,
    });
    expects(s).not.eql(s1);
  });


  it('#rootReducer should immutably reduce a failed action on state', () => {
    action.payload.status = FAILED;
    action.payload.message = 'Request failed';

    const s = rootReducer(providerStateMock, action);
    const s1 = rootReducer(providerStateMock, action);
    const req = getState(s.data, action.payload.id);

    expects(req).to.be.an('object').that.deep.includes({
      id, failed: true, success: false, pending: false, message: action.payload.message,
    });
    expects(s).not.eql(s1);
  });


  it('#rootReducer should immutably reduce a pending action on state', () => {
    action.payload.status = PENDING;
    action.payload.message = 'Loading...';

    const s = rootReducer(providerStateMock, action);
    const s1 = rootReducer(providerStateMock, action);
    const req = getState(s.data, action.payload.id);
    expects(req).to.be.an('object').which.deep.includes({
      id, failed: false, success: false, pending: true, message: action.payload.message,
    });
    expects(s).not.eql(s1);
  });

  it('#rootReducer should immutably reduce a `clean` action on state', () => {
    action.payload.status = CLEAN;

    const s = rootReducer(providerStateMock, action);
    const s1 = rootReducer(providerStateMock, action);
    const req = getState(s.data, action.payload.id);
    expects(req).to.be.an('object').which.deep.includes({ id, clean: true });
    expects(s).not.eql(s1);
  });

  it('#rootReducer should immutably reduce a `dirty` action on state', () => {
    action.payload.status = DIRTY;

    const s = rootReducer(providerStateMock, action);
    const s1 = rootReducer(providerStateMock, action);
    const req = getState(s.data, action.payload.id);
    expects(req).to.be.an('object').which.deep.includes({ id, clean: false });
    expects(s).not.eql(s1);
  });


  it('#rootReducer should immutably reduce a `remove` action on state', () => {
    action.payload.status = REMOVE;

    const s = rootReducer(providerStateMock, action);
    const s1 = rootReducer(providerStateMock, action);

    expects(Object.hasOwnProperty.call(s.data, id)).to.be.false()
    expects(s).not.eql(s1);
  });

  it('#rootReducer should immutably reduce a `remove` action on state', () => {
    action.payload.status = REMOVE;

    const s = rootReducer(providerStateMock, action);
    const s1 = rootReducer(providerStateMock, action);

    expects(Object.hasOwnProperty.call(s.data, id)).to.be.false()
    expects(s).not.eql(s1);
  });

  it('#rootReducer should immutably reduce a `replace` action on state', () => {
    action.payload.status = REPLACE;
    action.payload.state = providerStateMock.data;

    const s = rootReducer({}, action);
    const s1 = rootReducer({}, action);

    expects(s).not.eql(s1);
  });
});
