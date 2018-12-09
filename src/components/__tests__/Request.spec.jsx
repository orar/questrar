import React from 'react';
import { shallow } from 'enzyme';
import RequestPending from '../RequestPending';
import { initialRequest } from '../../utils/common';
import { Request } from '../Request';
import randomId from '../../utils/randomId';
import RequestFailure from '../RequestFailure';
import RequestSuccess from '../RequestSuccess';
import RequestPendOnMount from '../RequestPendOnMount';

const Requestor = () => <div className="request-or">Requestor</div>;


describe('[Component] Request', () => {
  let id;
  let requestState;
  let actions;
  let wrapper;
  let props;
  let requestData;

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
      <Request id={id} {...props} request={requestData} >
        <Requestor />
      </Request>,
    )
  };

  beforeEach(() => {
    id = randomId();
    props = {};
    createActions();
    requestState = Object.assign({ id }, initialRequest);
    requestData = {data: requestState, actions };
    createWrapper();
  });

  it('Should throw if `id` prop is not a request id type', () => {
    props.id = {};
    expects(() => createWrapper()).to.throw()

    props.id = [];
    expects(() => createWrapper()).to.throw()

    props.id = (r) => r;
    expects(() => createWrapper()).to.throw()

    props.id = undefined;
    expects(() => createWrapper()).to.throw()
  });

  it('Should not re-render if any of the defined Request$Props has not changed', () => {
    const instance = wrapper.instance();
    const nextProps = instance.props;

    const shouldUpdate = instance.shouldComponentUpdate(nextProps);
    expects(shouldUpdate).to.be.false();
  });

  it('Should render Requestor by default', () => {
    expects(wrapper.is(Requestor)).to.be.true();
  });

  describe('Request.pending', function () {
    beforeEach(() => {
      requestState.pending = true;
      createWrapper();
    });

    it('Should render a loading component on request pending', () => {
      expects(wrapper.first().is(RequestPending)).to.be.true();
    });

    it('Should render a custom `onPending` component on request pending', () => {
      expects(wrapper.is(RequestPending)).to.be.true();

      props.onPending = <div className="pending-comp">I'm pending</div>;
      createWrapper();
      expects(wrapper.dive().is('div.pending-comp')).to.be.true();
    });

    it('`onPending` prop should create a custom pending component' +
      ' when  requestState is pending', () => {
      expects(wrapper.is(RequestPending)).to.be.true();

      props.onPending = (r) => <div id={'_' + r.data.id} className="pending-comp">I'm pending</div>;
      createWrapper();
      expects(wrapper.dive().is('div.pending-comp')).to.be.true();
      expects(wrapper.dive().is(`div#_${requestState.id}`)).to.be.true();
    });

    it('Should render inject children if `inject` prop is set ', () => {
      props.inject = true;
      createWrapper();

      expects(wrapper.dive().is(Requestor)).to.be.true();
    });
  });

  describe('Request.failed', () => {
    beforeEach(() => {
      requestState.failed = true;
    });

    it('Should render a RequestFailure on request failed', () => {
      requestState.failureCount = 1;
      createWrapper();

      expects(wrapper.is(RequestFailure)).to.be.true();
      expects(wrapper.prop('request').data).to.be.eql(requestState);
    });

    it('Should render a custom failure component on request failure', () => {
      props.onFailure = <div className="renderOFailo">Im rendering like o failo</div>
      createWrapper();

      expects(wrapper.dive().is('div.renderOFailo')).to.be.true();
    });

    it('Should render a custom failure component' +
      ' created by on `onFailure` prop request failure', () => {
      props.onFailure = (r) => (
        <div title={r.data.id} className="renderOFailo">Im rendering like o failo</div>
      );
      createWrapper();

      expects(wrapper.dive().is('div.renderOFailo')).to.be.true();
      expects(wrapper.dive().is(`div[title="${requestState.id}"]`)).to.be.true();
    });

    it('Should render children if `onFailure` is not set', () => {
      expects(wrapper.is(Requestor)).to.be.true();
    })

  });

  describe('Request.success', () => {
    beforeEach(() => {
      requestState.success = true;
      requestState.successCount = 1;
      createWrapper();
    });

    it('Should render RequestSuccess', () => {
      expects(wrapper.is(RequestSuccess)).to.be.true();
    });

    it('Should render children on request success by default', () => {
      expects(wrapper.dive().is(Requestor)).to.be.true();
    });

    it('Should render a custom failure component on request failure', () => {
      props.onSuccess = <div className="successComp">Im rendering like winner</div>
      createWrapper();

      expects(wrapper.dive().is('div.successComp')).to.be.true();
    });

    it('Should render a custom success component' +
      ' created by on `onSuccess` prop request failure', () => {
      props.onSuccess = (r) => (
        <div title={r.data.id} className="successComp">Im rendering like winner</div>
      );
      createWrapper();

      expects(wrapper.dive().is('div.successComp')).to.be.true();
      expects(wrapper.dive().is(`div[title="${requestState.id}"]`)).to.be.true();
    });
  });

  describe('pendOnMount', function () {
    beforeEach(() => {
      props.pendOnMount = true;
      createWrapper();
    });

    it('Should render a RequestPendOnMount component on `pendOnMount` set', () => {
      expects(wrapper.is(RequestPendOnMount)).to.be.true();
    });

    it('Should fallback to RequestPending component if `pendOnMount` is not set as custom (node or function)', () => {
      expects(wrapper.dive().is(RequestPending)).to.be.true();
    });

    it('Should render once a custom component created by `pendOnMount` set as a function', () => {
      props.pendOnMount = (r) => <div role={r.data.id} className="pendant">Ya, Im so pendy on fly!</div>;
      createWrapper();
      expects(wrapper.dive().is(`div[role="${requestState.id}"]`)).to.be.true();
    });
  });
});
