import { isFSA } from 'flux-standard-action';
import { randomId } from '../../module/helper';
import { REQUEST_ACTION_TYPE } from '../common';
import {FAILED, PENDING, REMOVE, SUCCESS, DIRTY, CLEAN} from '../../module/common';
import createRequest from '../createRequest';

describe('[Function] createRequest', () => {
  let id;
  let requestState;

  beforeEach(() => {
    id = randomId();
    requestState = createRequest(id)
  });


  it('should be a function', () => {
    expects(createRequest).to.be.a('function');
  });

  it('Should create an random id if no id is provided by user', () => {
    requestState = createRequest();
    const anotherState = createRequest();
    expects(requestState.id).to.not.equal(anotherState.id);
  });

  it('should be able to extract id of the request', () => {
    expects(requestState).to.be.a('function');
    expects(requestState()).to.be.a('string').that.is.equal(id);
    expects(requestState.id).to.be.a('string').that.is.equal(id);
    expects(requestState.toString()).to.be.equal(id);
  });


  it('#pending Should create an FSA request pending action', () => {
    const message = 'Loading';
    expects(requestState.pending).to.be.a('function');
    expects(isFSA(requestState.pending())).to.be.true();
    expects(requestState.pending(message)).to.deep
      .include({
        type: REQUEST_ACTION_TYPE,
        payload: { id, status: PENDING, message },
      })
  });

  it('#failed Should create an FSA request success action', () => {
    const message = 'Sorry, request failed';
    expects(requestState.failed).to.be.a('function');
    expects(isFSA(requestState.failed())).to.be.true();
    expects(requestState.failed(message)).to.deep
      .include({
        type: REQUEST_ACTION_TYPE,
        payload: { id, message, status: FAILED },
      });
  });


  it('#success Should create an FSA request success action', () => {
    const message = 'Request successful';
    expects(requestState.success).to.be.a('function');
    expects(isFSA(requestState.success())).to.be.true();
    expects(requestState.success(message)).to.deep
      .include({
        type: REQUEST_ACTION_TYPE,
        payload: { id, message, status: SUCCESS },
      });
  });


  it('#remove Should create an FSA remove request state action', () => {
    expects(requestState.remove).to.be.a('function');
    expects(isFSA(requestState.remove())).to.be.true();
    expects(requestState.remove()).to.deep
      .include({
        type: REQUEST_ACTION_TYPE,
        payload: { id, status: REMOVE },
      });
  });


  it('#dirty Should create an FSA which sets a request `clean` state to `false`', () => {
    expects(requestState.dirty).to.be.a('function');
    expects(isFSA(requestState.dirty())).to.be.true();
    expects(requestState.dirty()).to.deep
      .include({
        type: REQUEST_ACTION_TYPE,
        payload: { id, status: DIRTY },
      });
  });


  it('#clean Should create an FSA which sets a request `clean` state to `true`', () => {
    expects(requestState.clean).to.be.a('function');
    expects(isFSA(requestState.clean())).to.be.true();
    expects(requestState.clean()).to.deep
      .include({
        type: REQUEST_ACTION_TYPE,
        payload: { id, status: CLEAN },
      });
  });
});
