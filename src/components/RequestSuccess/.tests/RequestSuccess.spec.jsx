import React from 'react';
import { shallow } from 'enzyme';
import Popover from 'react-popover';
import RequestSuccess from '../RequestSuccess';
import { randomId } from '../../../module/helper';
import { initialRequest } from '../../../module/common';
import Banner from '../../Banner';

const Requestor = () => <div>Requesting Component</div>;

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

  it('Should be able to render Popover with a custom className set on Popover', () => {
    props.className = 'customPopoverContainer';
    props.popoverOnSuccess = true;
    requestState.message = <div className="customizedSuccess">Custom message element </div>;
    createWrapper();

    expects(wrapper.is(Popover)).to.be.true();
    expects(wrapper.first().prop('className')).to.match(/customPopoverContainer/);
  });

  it('#popoverContent should create `Popover` content with a custom default classNames', () => {
    requestState.message = 'Custom request status message';
    createWrapper();

    const content = wrapper.instance().popoverContent();
    const props = shallow(content).props();
    expects(props).to.include({ className: 'q-popover-content-success' });
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

    expects(wrapper.is(Banner)).to.be.true()
  });

  it('#closePopover should not call `onCloseSuccess` callback only when request is dirty', () => {
    requestState.clean = false;
    props.onCloseSuccess = jest.fn();
    createWrapper();

    wrapper.instance().closePopover();
    expect(props.onCloseSuccess).not.toHaveBeenCalled()
  });

  it('#closePopover should call `onCloseSuccess` callback only when request is clean', () => {
    requestState.clean = true;
    const onCloseSuccess = jest.fn();
    props.onCloseSuccess = onCloseSuccess;
    createWrapper();

    wrapper.instance().closePopover();
    expect(onCloseSuccess).toHaveBeenNthCalledWith(1, { data: requestState, actions })
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
