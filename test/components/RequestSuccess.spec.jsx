import React from 'react';
import { shallow } from 'enzyme';
import Popover from 'react-popover';
import RequestSuccess from '../../src/components/RequestSuccess';
import { randomId } from '../../src/module/helper';
import { initialRequest } from '../../src/module/common';


const Requestor = () => <div>Requesting Component</div>

describe('<RequestSuccess />', () => {
  let id;
  let requestState;
  let actions;
  let props;
  let wrapper;

  const createWrapper = () => {
    wrapper = shallow(
      <RequestSuccess id={id} {...props} request={requestState} actions={actions}>
        <Requestor />
      </RequestSuccess>
    )
  };

  const createActions = () => {
    actions = {
      success: jest.fn(),
      failed: jest.fn(),
      pending: jest.fn(),
      remove: jest.fn(),
      dirty: jest.fn(),
      clean: jest.fn(),
    }
  };

  beforeEach(() => {
    props = {};
    id = randomId();
    requestState = Object.assign({}, initialRequest, { id, success: true, successCount: 1 });
    createActions();
    createWrapper();
  });

  it('Should not render a popover if `popoverOnSuccess` is true and there is no message', () => {
    props.popoverOnSuccess = true;
    createWrapper();

    expects(wrapper.is(Requestor)).to.be.true();
  });

  it('Should render a popover if `popoverOnSuccess` is true and there is message', () => {
    props.popoverOnSuccess = true;
    requestState.message = 'You can now see me';
    createWrapper();

    expects(wrapper.is(Popover)).to.be.true();
  });

  it('Should render injected children if `inject` prop is set true', () => {
    props.inject = true;
    createWrapper();

    expects(wrapper.is(Requestor)).to.be.true();
    expects(wrapper.prop('request')).to.nested.include({ 'data.success': true });
  });

  it('Should render custom injected props into children if `inject` is a provided function', () => {
    props.inject = r => ({ showBanner: r.data.success, alert: 'Request successful' });
    createWrapper();

    expects(wrapper.is(Requestor)).to.be.true();
    expects(wrapper.props()).to.include({ showBanner: true, alert: 'Request successful' });
  });

  it('Should replace children with message if `successReplace` is set true', () => {
    props.successReplace = true;
    requestState.message = <div className="successReplacer">A successful message</div>;
    createWrapper();

    expects(wrapper.is('div.successReplacer')).to.be.true()
  });
});
