import { randomId } from "../../src/module/helper";
import {
  rootReducer,
  replaceState,
  removeRequestState,
  handleRequestSuccess,
  handleRequestFailed,
  handleRequestPending,
  setMessage,
  getState,
  setRemoves
} from 'src/redux/RequestReducer';
import {FAILED, initialRequest, PENDING, REMOVE, SUCCESS} from "../../src/module/common";
import {REQUEST_ACTION_TYPE} from "../../src/redux/common";


describe('[RequestReducer]', () => {
  let idList;
  let id;
  let requestState;
  let action;
  let providerStateMock;


  beforeEach(() => {
    idList = Array(3).fill(1).map(_ => randomId());

    id = idList[0];
    requestState = Object.assign({ id }, initialRequest);
    action = { type: REQUEST_ACTION_TYPE, id }

    providerStateMock = {
      data: idList.reduce((acc, id) => {
        const req = Object.assign({ id }, initialRequest);
        return Object.assign({}, acc, { [id]: req });
      }, {}),
      actions: {}
    };
  });


  it('#setRemoves should set the proper flag for request state auto removal', () => {
    action.autoRemove = true;
    action.autoRemoveOnSuccess = true;
    const rm = setRemoves(requestState, action);

    expect(rm).to.be.a('object').that.include({ id });
    expect(rm.autoRemove).to.be.undefined();
    expect(rm.removeOnSuccess).to.be.true();
  });


  it('#setMessage should set message on a request state', () => {
    action.message = 'New happy message';
    setMessage(requestState, action);

    expect(requestState).to.be.an('object').that.include({ message: action.message });
  });


  it('#getState should get a particular request state from whole state', () => {
    const state = getState(providerStateMock, id);

    expect(state.id).to.be.equal(id);
  });

  it('#getState should substitute a not found request state with default', () => {
    const state = getState(providerStateMock, 'strangeId');

    expect(state.id).to.be.undefined();
  });

  it('#handleRequestPending should handle action request pending', () => {
    const states = handleRequestPending(providerStateMock, action);
    const req = getState(states, action.id);
    expect(req).to.be.an('object').that.include({ id, failed: false, success: false, pending: true, message: action.message });
  });


  it('#handleRequestSuccess should handle action request pending', () => {
    const states = handleRequestSuccess(providerStateMock, action);
    const req = getState(states, action.id);
    expect(req).to.be.an('object')
      .that.include({ id, failed: false, success: true, pending: false, message: action.message });
    expect(req.successCount).to.be.equal(1);
  });

  it('#handleRequestFailed should handle action request pending', () => {
    const states = handleRequestFailed(providerStateMock, action);
    const req = getState(states, action.id);
    expect(req).to.be.an('object')
      .that.include({ id, failed: true, success: false, pending: false, message: action.message });
    expect(req.failureCount).to.be.equal(1);
  });



  it('#removeRequestState should remove completely a request state', () => {
    action.status = REMOVE;
    const states = removeRequestState(providerStateMock, action);
    const req = getState(states, action.id);

    expect(req.id).to.be.undefined();
  });

  /*it('#replaceState should replace old state with new given', () => {
    ignore();
  });*/

  it('#rootReducer should reduce a success action to state detached', () => {
    action.status = SUCCESS;
    action.message = 'New happy message';

    const s = rootReducer(providerStateMock, action);
    const req = getState(s, action.id);
    expect(req).to.be.an('object').that.includes({ id, failed: false, success: true, pending: false, message: action.message });
  });


  it('#rootReducer should reduce a failed action to state - detached', () => {
    action.status = FAILED;
    action.message = 'Request failed';

    const s = rootReducer(providerStateMock, action);
    const req = getState(s, action.id);
    expect(req).to.be.an('object').that.includes({ id, failed: true, success: false, pending: false, message: action.message });
  });


  it('#rootReducer should reduce a success action to state - detached', () => {
    action.status = PENDING;
    action.message = 'Loading...';

    const s = rootReducer(providerStateMock, action);
    const req = getState(s, action.id);
    expect(req).to.be.an('object').which.includes({ id, failed: false, success: false, pending: true, message: action.message });
  });


});