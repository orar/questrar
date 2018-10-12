import { randomId } from "../../src/module/helper";
import createRequest from 'src/redux/createRequest';
import { REQUEST_ACTION_TYPE } from "../../src/redux/common";
import {FAILED, PENDING, REMOVE, SUCCESS} from "../../src/module/common";

describe('[createRequest]', () => {

  let id;

  beforeEach(() => {
    id = randomId();

  });

  it('should be a function', () => {
    expect(createRequest).to.be.a('function');
  });

  it('should be able to extract id of the request', () => {
    const request = createRequest(id);
    expect(request).to.be.a('object');
    expect(request()).to.be.a('string').that.is.equal(id);
    expect(request.id).to.be.a('string').that.is.equal(id);
    expect(request.toString()).to.be.equal(id);
  });


  it('should have a pending function which creates a redux action', () => {
    const request = createRequest(id);
    const message = 'Loading';
    const pending = request.pending(message);

    expect(request.pending).to.be.a('function');
    expect(pending).to.be.an('object').that.has.all.keys(['type', 'id', 'status', 'message']);
    expect(pending).to.include({ type: REQUEST_ACTION_TYPE, id, message, status: PENDING })
  });


  it('should have a failed function which creates a redux action', () => {
    const request = createRequest(id);
    const message = 'Sorry, request failed';
    const req = request.failed(message);

    expect(request.failed).to.be.a('function');
    expect(req).to.be.an('object').that.has.all.keys(['type', 'id', 'status', 'message']);
    expect(req).to.include({ type: REQUEST_ACTION_TYPE, id, message, status: FAILED });
    expect(req).to.not.have.keys([ 'autoRemove', 'autoRemoveOnFailure', 'autoRemoveOnSuccess' ]);
    expect(request.failed(message, true)).to.have.all.keys('autoRemoveOnFailure');

  });


  it('should have a failed function which creates a redux action', () => {
    const request = createRequest(id);
    const message = 'Request successful';
    const req = request.success(message);

    expect(request.success).to.be.a('function');
    expect(req).to.be.an('object').that.has.all.keys(['type', 'id', 'status', 'message']);
    expect(req).to.include({ type: REQUEST_ACTION_TYPE, id, message, status: SUCCESS });
    expect(req).to.not.have.keys([ 'autoRemove', 'autoRemoveOnFailure', 'autoRemoveOnSuccess' ]);
    expect(request.success(message, true)).to.have.all.keys('autoRemoveOnSuccess');
  });


  it('should have a failed function which creates a redux action', () => {
    const request = createRequest(id);
    const req = request.remove();

    expect(request.remove).to.be.a('function');
    expect(req).to.be.an('object').that.has.all.keys(['type', 'id', 'status']);
    expect(req).to.include({ type: REQUEST_ACTION_TYPE, id, status: REMOVE });
  });

});