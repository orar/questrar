import React from 'react';
import { shallow } from 'enzyme';
import Popover from 'react-popover';
import RequestError from '../RequestError';
import { randomId } from '../../../module/helper';
import { initialRequest } from '../../../module/common';
import Banner from '../../Banner';


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


  it('Should render a Banner if no alternating prop is set', () => {
    expects(wrapper.is(Banner)).to.be.true();
  });

  it('Should not render a custom failure message element if set', () => {
    requestState.message = <div className="customFailure">Custom message element </div>;
    createWrapper();
    expects(wrapper.dive().is('div.customFailure')).to.be.true();
  });

  it('Should render a Banner on default props if message is set', () => {
    requestState.message = {
      title: <div className="customFailureTitle">Custom message element </div>,
      body: 'I have a message for you Darling'
    };
    createWrapper();

    expects(wrapper.is(Banner)).to.be.true();
    expects(wrapper.prop('message')).to.be.eql(requestState.message);
  });

  it('Should render a Banner with default message if no message prop is set', () => {
    expects(wrapper.prop('defaultMessage')).to.be.equal('An error occurred. Please try again later.');
  });

  it('Should render a Banner with `failureContainer` default className', () => {
    expects(wrapper.prop('className')).to.be.equal('failureContainer');
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

    expects(wrapper.is(Popover)).to.be.false();
    expects(wrapper.is(Banner)).to.be.true();
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

  it('#popoverContent should create `Popover` content with a custom default classNames', () => {
    requestState.message = 'Custom request status message';
    createWrapper();

    const content = wrapper.instance().popoverContent();
    const props = shallow(content).props();
    expects(props).to.include({ className: 'q-popover-content-failed' });
  });

  it('#closePopover should not call `onCloseFailure` callback only when request is dirty', () => {
    requestState.clean = false;
    const onCloseFailure = jest.fn();
    props.onCloseFailure = onCloseFailure;
    createWrapper();

    wrapper.instance().closePopover();
    expect(onCloseFailure).not.toHaveBeenCalled()
  });

  it('#closePopover should call `onCloseFailure` callback only when request is clean', () => {
    requestState.clean = true;
    const onCloseFailure = jest.fn();
    props.onCloseFailure = onCloseFailure;
    createWrapper();

    wrapper.instance().closePopover();
    expect(onCloseFailure).toHaveBeenNthCalledWith(1, { data: requestState, actions })
  });

  it('#closePopover should set request to dirty only when' +
    ' request is clean with no auto-remove flags', () => {
    requestState.clean = true;
    createWrapper();

    wrapper.instance().closePopover();
    expect(actions.dirty).toHaveBeenNthCalledWith(1, requestState.id)
  });

  it('#closePopover should not set request to dirty only when' +
    ' request is already dirty regardless of auto-remove flags', () => {
    requestState.clean = false;
    createWrapper();

    wrapper.instance().closePopover();
    expect(actions.dirty).not.toHaveBeenNthCalledWith()
  });

  it('#closePopover should set `state.open` to false', () => {
    createWrapper();

    wrapper.instance().closePopover();
    expects(wrapper.state('open')).to.be.false()
  });


  it('#closePopover should remove request state only when' +
    ' request state is clean and `autoRemove` is true', () => {
    requestState.clean = true;
    requestState.autoRemove = true;
    createWrapper();

    wrapper.instance().closePopover();
    expect(actions.remove).toHaveBeenNthCalledWith(1, requestState.id);
    expect(actions.dirty).not.toHaveBeenCalled();
  });

 it('#closePopover should remove request state only when' +
    ' request state is clean and `removeOnFail` is set true', () => {
    requestState.clean = true;
    requestState.removeOnFail = true;
    createWrapper();

    wrapper.instance().closePopover();
    expect(actions.remove).toHaveBeenNthCalledWith(1, requestState.id);
    expect(actions.dirty).not.toHaveBeenCalled();
  });

 it('#willUnmount should call closePopover', () => {
   requestState.clean = true;
   createWrapper();
    expects(wrapper.state('open')).to.be.true();
    wrapper.unmount();
    expect(actions.dirty).toHaveBeenNthCalledWith(1, requestState.id);
  });


});
