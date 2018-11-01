import React from 'react';
import { shallow } from 'enzyme';
import Popover from 'react-popover';
import RequestError from '../../src/components/RequestError';
import { randomId } from '../../src/module/helper';
import { initialRequest } from '../../src/module/common';

const Requestor = () => <div>Requesting Component</div>


describe('<RequestError />', () => {
  let id;
  let requestState;
  let actions;
  let props;
  let wrapper;

  const createWrapper = () => {
    wrapper = shallow(
      <RequestError id={id} {...props} request={requestState} actions={actions}>
        <Requestor />
      </RequestError>
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
    requestState = Object.assign({}, initialRequest, { id, failed: true, failureCount: 1 });
    createActions();
    createWrapper();
  });


  it('Should render default error message if no alternating prop is set', () => {
    expects(wrapper.is('div.failureContainer')).to.be.true();
  });

  it('Should not render a custom message element if set', () => {
    requestState.message = <div className="customFailure">Custom message element </div>;
    createWrapper();

    expects(wrapper.is('div.customFailure')).to.be.true();
  });

  it('Should render a custom message with title if message is set as an object', () => {
    requestState.message = {
      title: <div className="customFailureTitle">Custom message element </div>,
      body: 'I have a message for you Darling'
    };
    createWrapper();

    expects(wrapper.is('div.failureContainer')).to.be.true();
    expects(wrapper.children()).to.be.lengthOf(2);
    expects(wrapper.children().first().prop('className')).to.match(/customFailureTitle/)
  });

  it('Should render children on `inject` set true', () => {
    props.inject = true;
    requestState.message = <div className="customFailure">Custom message element </div>;
    createWrapper();

    expects(wrapper.is(Requestor)).to.be.true();
  });

  it('Should render children on `passiveOnFail` set true', () => {
    props.passiveOnFail = true;
    requestState.message = <div className="customFailure">Custom message element </div>;
    createWrapper();

    expects(wrapper.is(Requestor)).to.be.true();
  });

  it('Should not render a popover if `popoverOnFail` is true and there is no message', () => {
    props.popoverOnFail = true;
    createWrapper();

    expects(wrapper.is('div.failureContainer')).to.be.true();
  });

  it('Should render a popover if `popoverOnFail` is true and there is message', () => {
    props.popoverOnFail = true;
    requestState.message = <div className="customFailure">Custom message element </div>;
    createWrapper();

    expects(wrapper.is(Popover)).to.be.true();
    expects(wrapper.first().children().first().is(Requestor)).to.be.true();
  });

  it('Should be able to render Popover with a custom className set on Popover', () => {
    props.className = 'customPopoverContainer';
    props.popoverOnFail = true;
    requestState.message = <div className="customFailure">Custom message element </div>;
    createWrapper();

    expects(wrapper.is(Popover)).to.be.true();
    expects(wrapper.first().prop('className')).to.match(/customPopoverContainer/);
  });

  it('Should create `Popover` content with a customizable className', () => {
    requestState.message = 'Custom request status message';
    createWrapper();

    const content = wrapper.instance().createContent();
    const shallowContent = shallow(content);
    expects(shallowContent.is('div.q-popover-content-failed')).to.be.true();
  });

  it('Should create a fully customizable `Popover` content when message has title and body', () => {
    requestState.message = {
      title: 'Custom message title',
      body: 'This is the custom message body',
    };
    createWrapper();

    const content = wrapper.instance().createContent();
    const shallowContent = shallow(content);
    expects(shallowContent.is('div.q-popover-content-failed')).to.be.true();
    expects(shallowContent.children()).to.be.lengthOf(2);
    expects(shallowContent.children().first().is('div.q-popover-title-failed'))
  });
});
