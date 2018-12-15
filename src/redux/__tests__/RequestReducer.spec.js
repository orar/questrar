import randomId  from '../../utils/randomId';
import {
  initialState,
  rootReducer,
  removeRequestState,
  handleRequestSuccess,
  handleRequestFailed,
  handleRequestPending,
  setMessage,
  handleRequestClean,
  handleRequestDirty,
  handleRequest,
} from '../RequestReducer';
import { selectSingleRequestState } from '../../utils/selectRequestStates';
import {
  CLEAN,
  DIRTY,
  FAILED,
  initialRequest,
  PENDING,
  REMOVE,
  SUCCESS,
} from '../../utils/common';
import { REQUEST_ACTION_TYPE } from '../common';


describe('[RequestReducer]', () => {
  let idList;
  let id;
  let requestState;
  let action;
  let providerStateMock;

  const mockProviderState = () => {
    const data = idList.reduce((acc, id) => {
      const req = Object.assign({ id }, initialRequest);
      return Object.assign(acc, { [id]: req });
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

  it('#setMessage should set message on a request state', () => {
    action.payload.message = 'New happy message';
    setMessage(requestState, action.payload);

    expects(requestState).to.be.an('object').that.includes({ message: action.payload.message });
  });



  it('#handleRequest should handle request using provided transformer function', () => {
    const transformer = jest.fn((r, a) => r);
    handleRequest(transformer)(providerStateMock, action.payload)
    const state = selectSingleRequestState(action.payload.id, providerStateMock.data);

    expect(transformer).toHaveBeenCalledTimes(1)
  });

  it('#handleRequest should handle request immutably', () => {
    const transformer = (r, a) => { r.success = true; return r };

    const states = handleRequest(transformer)(providerStateMock, action.payload);
    const states1 = handleRequest(transformer)(providerStateMock, action.payload);
    const req = selectSingleRequestState(action.payload.id, states.data);

    expects(req).to.be.an('object').that.deep.includes({
      id, failed: false, success: true, pending: false,
    });
    expects(states).not.eql(states1)
  });

  it('#handleRequestPending should immutably handle a request `pending` action', () => {
    const states = handleRequestPending(providerStateMock, action.payload);
    const states1 = handleRequestPending(providerStateMock, action.payload);
    const req = selectSingleRequestState(action.payload.id, states.data);

    expects(req).to.be.an('object').that.deep.includes({
      id, failed: false, success: false, pending: true,
    });
    expects(states).not.eql(states1)
  });


  it('#handleRequestSuccess should immutably handle a  request action `success`', () => {
    action.payload.message = 'Request successful';
    const states = handleRequestSuccess(providerStateMock, action.payload);
    const states1 = handleRequestSuccess(providerStateMock, action.payload);
    const req = selectSingleRequestState(action.payload.id, states.data);
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
    const req = selectSingleRequestState(action.payload.id, states.data);

    expects(req).to.be.an('object').that.deep.includes({
      id, failed: true, success: false, pending: false, message: action.payload.message,
    });
    expects(req.failureCount).to.be.equal(1);
    expects(states).not.eql(states1)
  });

  it('#removeRequestState should immutably remove a request state completely', () => {
    const states = removeRequestState({ ...providerStateMock}, action.payload);
    const states1 = removeRequestState(providerStateMock, action.payload);

    expects(Object.hasOwnProperty.call(states.data, id)).to.be.false();
    expects(states).not.eql(states1)
  });

  it('#removeRequestState should not reassign requestStates' +
    ' if no request is found to remove', () => {
    action.payload.id = "unknownId";
    const states = removeRequestState(providerStateMock, action.payload);
    const states1 = removeRequestState(providerStateMock, action.payload);

    expects(Object.hasOwnProperty.call(states.data, action.payload.id)).to.be.false();
    expects(states).to.eql(states1)
  });


  it('#handleRequestClean should only immutably set a request state as `clean`', () => {
    const dirty = handleRequestDirty(providerStateMock, action.payload);
    const states = handleRequestClean(dirty, action.payload);
    const states1 = handleRequestClean(dirty, action.payload);
    const req = selectSingleRequestState(id, states.data);

    expects(req).to.be.an('object').that.includes({ id, clean: true });
    expects(states).not.eql(states1)
  });

  it('#handleRequestDirty should only immutably set a request state as not `clean`', () => {
    const states = handleRequestDirty(providerStateMock, action.payload);
    const states1 = handleRequestDirty(providerStateMock, action.payload);
    const req = selectSingleRequestState(id, states.data);

    expects(req).to.be.an('object').that.includes({ id, clean: false });
    expects(states).not.eql(states1)
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
    const req = selectSingleRequestState(action.payload.id, s.data);

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
    const req = selectSingleRequestState(action.payload.id, s.data);

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
    const req = selectSingleRequestState(action.payload.id, s.data);
    expects(req).to.be.an('object').which.deep.includes({
      id, failed: false, success: false, pending: true, message: action.payload.message,
    });
    expects(s).not.eql(s1);
  });

  it('#rootReducer should immutably reduce a `clean` action on state', () => {
    action.payload.status = CLEAN;

    const s = rootReducer(providerStateMock, action);
    const s1 = rootReducer(providerStateMock, action);
    const req = selectSingleRequestState(action.payload.id, s.data);
    expects(req).to.be.an('object').which.deep.includes({ id, clean: true });
    expects(s).not.eql(s1);
  });

  it('#rootReducer should immutably reduce a `dirty` action on state', () => {
    action.payload.status = DIRTY;

    const s = rootReducer(providerStateMock, action);
    const s1 = rootReducer(providerStateMock, action);
    const req = selectSingleRequestState(action.payload.id, s.data);
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

});
