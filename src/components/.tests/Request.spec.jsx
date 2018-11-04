import React from 'react';
import { shallow } from 'enzyme';
import RequestPending from '../RequestPending';
import { initialRequest } from '../../module/common';
import { Request } from '../Request';
import { randomId } from '../../module/helper';
import RequestError from '../RequestError';
import RequestSuccess from '../RequestSuccess';

const Requestor = () => <div className="request-or">Requestor</div>;

describe('<Request />', () => {
  let id;
  let requestState;
  let actions;
  let wrapper;
  let props;

  const createActions = () => {
    actions = {
      success: jest.fn(),
      pending: jest.fn(),
      failed: jest.fn(),
      remove: jest.fn(),
      dirty: jest.fn(),
      clean: jest.fn(),
    };
  };

  const createWrapper = () => {
    wrapper = shallow(
      <Request id={id} {...props} request={requestState} actions={actions}>
        <Requestor />
      </Request>,
    )
  };

  beforeEach(() => {
    id = randomId();
    props = {};
    requestState = Object.assign({ id }, initialRequest);
    createActions();
    createWrapper();
  });

  it('Should render Requestor by default', () => {
    expects(wrapper.is(Requestor)).to.be.true();
  });

  describe('Request.pending', function () {
    it('Should render a loading component on request pending', () => {
      requestState.pending = true;
      createWrapper();
      expects(wrapper.first().is(RequestPending)).to.be.true();
    });

    it('Should render a custom `renderPending` component on request pending', () => {
      requestState.pending = true;
      createWrapper();
      expects(wrapper.is(RequestPending)).to.be.true();

      props.renderPending = <div className="pending-comp">I'm pending</div>;
      createWrapper();
      expects(wrapper.is('div.pending-comp')).to.be.true();
    });

    it('`renderPending` prop should create a custom pending component' +
      ' when given requestState on request pending', () => {
      requestState.pending = true;
      createWrapper();
      expects(wrapper.is(RequestPending)).to.be.true();

      props.renderPending = (r) => <div id={'_' + r.data.id} className="pending-comp">I'm pending</div>;
      createWrapper();
      expects(wrapper.is('div.pending-comp')).to.be.true();
      expects(wrapper.is(`div#_${requestState.id}`)).to.be.true();
    });

    it('Should render children on `passivePending`', () => {
      props.passivePending = true;
      createWrapper();

      expects(wrapper.is(Requestor)).to.be.true();
    });
  });

  describe('Request.failed', function () {
    it('Should call `onFailure` callback if set - on request failure', () => {
      requestState.failed = true;
      props.onFailure = jest.fn();
      createWrapper();

      expect(props.onFailure).toHaveBeenNthCalledWith(1, { data: requestState, actions })
    });

    it('Should set requestState to dirty if `onFailure` callback if set - on request failure', () => {
      requestState.failed = true;
      props.onFailure = () => {};
      createWrapper();

      expect(actions.dirty).toHaveBeenNthCalledWith(1, requestState.id)
    });

    it('Should render a custom failure component on request failure', () => {
      requestState.failed = true;
      props.renderOnFail = <div className="renderOFailo">Im rendering like o failo</div>
      createWrapper();

      expects(wrapper.is('div.renderOFailo')).to.be.true();
    });

    it('Should render a custom failure component' +
      ' created by on `renderOnFail` prop request failure', () => {
      requestState.failed = true;
      props.renderOnFail = (r) => (
        <div title={r.data.id} className="renderOFailo">Im rendering like o failo</div>
      );
      createWrapper();

      expects(wrapper.is('div.renderOFailo')).to.be.true();
      expects(wrapper.is(`div[title="${requestState.id}"]`)).to.be.true();
    });

    it('Should render a RequestError on request failed', () => {
      requestState.failed = true;
      requestState.failureCount = 1;
      createWrapper();

      expects(wrapper.is(RequestError)).to.be.true();
      expects(wrapper.prop('request')).to.be.eql(requestState);
    });
  });

  describe('Request.success', () => {
    it('Should call `onSuccess` callback if set - on request success', () => {
      requestState.success = true;
      props.onSuccess = jest.fn();
      createWrapper();

      expect(props.onSuccess).toHaveBeenNthCalledWith(1, { data: requestState, actions })
    });

    it('Should set requestState to dirty if `onSuccess` callback if set - on request success', () => {
      requestState.success = true;
      props.onSuccess = () => {};
      createWrapper();

      expect(actions.dirty).toHaveBeenNthCalledWith(1, requestState.id)
    });

    it('Should render children on request success', () => {
      requestState.success = true;
      requestState.successCount = 1;
      props.inject = true;
      createWrapper();

      expects(wrapper.is(Requestor)).to.be.true();
      expects(wrapper.first().prop('request')).to.nested.include({ 'data.success': true, 'data.successCount': 1 })
    });

    it('Should render a RequestSuccess component when `popoverSuccess` is set true on request success', () => {
      requestState.success = true;
      createWrapper();
      expects(wrapper.is(Requestor)).to.be.true();

      props.inject = true;
      props.popoverOnSuccess = true;
      createWrapper();
      expects(wrapper.is(RequestSuccess)).to.be.true();
      expects(wrapper.dive().first().prop('request')).to.nested.include({ 'data.success': true });
    });

    it('Should render a RequestSuccess component when `successReplace` is set true on request success', () => {
      requestState.success = true;
      //requestState.message = <div className="sseccus">My success now!</div>
      createWrapper();
      expects(wrapper.is(Requestor)).to.be.true();

      props.inject = true;
      props.successReplace = true;
      createWrapper();
      expects(wrapper.is(RequestSuccess)).to.be.true();
      expects(wrapper.prop('request')).to.nested.include({ success: true });
    });

  });


  describe('pendOnMount', function () {
    it('Should render a RequestPending component on `pendOnMount`', () => {
      props.pendOnMount = true;
      createWrapper();
      expects(wrapper.is(RequestPending)).to.be.true();
    });

    it('Should render once a custom component created by `renderPendOnMount`', () => {
      props.pendOnMount = true;
      props.renderPendOnMount = (r) => <div role={r.data.id} className="pendant">Im so pendy fly!</div>;
      createWrapper();
      expects(wrapper.is(`div[role="${requestState.id}"]`)).to.be.true();

      requestState.pending = true;
      wrapper.setProps({ request: requestState });
      expects(wrapper.is(RequestPending)).to.be.true();
    });

    it('`renderPendOnMount` should fallback to `renderPending` if no set', () => {
      props.pendOnMount = true;
      props.renderPending = r => <div role={r.data.id} className="pendant">Im so pendy fly!</div>;
      createWrapper();
      expects(wrapper.is(`div[role="${requestState.id}"]`)).to.be.true();

      requestState.pending = true;
      wrapper.setProps({ request: requestState });
      expects(wrapper.is(`div[role="${requestState.id}"]`)).to.be.true();
    })

  });
});
