import React from 'react';
import { shallow } from 'enzyme';
import RequestPending from '../../src/components/RequestPending/RequestPending';
import { initialRequest } from '../../src/module/common';
import { Request } from '../../src/components/Request';
import { randomId } from '../../src/module/helper';
import RequestError from '../../src/components/RequestError/RequestError';
import RequestSuccess from '../../src/components/RequestSuccess';

const Requestor = () => <div>Requestor</div>

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

  it('Should render a loading component on initialLoading', () => {
    props.pendOnMount = true;
    createWrapper();
    expects(wrapper.is(RequestPending)).to.be.true();
  });

  it('Should render a loading component on request pending', () => {
    requestState.pending = true;
    createWrapper();
    expects(wrapper.first().is(RequestPending)).to.be.true();
  });

  it('Should inject request state and actions into component', () => {
    props.inject = true;
    createWrapper();
    const request = wrapper.first().prop('request');

    expects(request).to.be.an('object').that.has.all.keys(['data', 'actions']);
    expects(request.data).to.eql(requestState);
  });

  it('Should transform an injected request state prop', () => {
    requestState.pending = true;
    wrapper.setProps({ inject: r => ({ loading: r.data.pending }), passivePending: true });

    const loading = wrapper.first().prop('loading');

    expects(loading).to.be.true();
  });

  it('Should render children on request success', () => {
    requestState.success = true;
    requestState.successCount = 1;
    props.inject = true;
    createWrapper();

    expects(wrapper.is(Requestor)).to.be.true();
    expects(wrapper.first().prop('request')).to.nested.include({ 'data.success': true, 'data.successCount': 1 })
  });

  it('Should render a RequestError on request success', () => {
    requestState.failed = true;
    requestState.failureCount = 1;
    props.inject = true;
    createWrapper();

    expects(wrapper.is(RequestError)).to.be.true();
  });


  it('Should render children on `passivePending`', () => {
    props.passivePending = true;
    createWrapper();

    expects(wrapper.is(Requestor)).to.be.true();
  });

  it('Should render children on all cases when `inject` is set and request is `failed`', () => {
    props.inject = true;
    requestState.failed = true;
    createWrapper();

    expects(wrapper.is(RequestError)).to.be.true();
    expects(wrapper.dive().first().prop('request')).to.nested.include({ 'data.failed': true });
  });

  it('Should render children on all cases when `inject` is set and request is `success`', () => {
    props.inject = true;
    requestState.success = true;
    createWrapper();

    expects(wrapper.is(Requestor)).to.be.true();

    props.popoverOnSuccess = true;
    createWrapper();
    expects(wrapper.is(RequestSuccess)).to.be.true();
    expects(wrapper.dive().first().prop('request')).to.nested.include({ 'data.success': true });
  });
});
