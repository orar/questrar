import React from 'react';
import Enzyme from 'enzyme';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RequestProvider from 'module/RequestProvider';
import {RequestProviderContext } from "../../src/module/context";
import {randomId } from "../../src/module/helper";


describe('<RequestProvider />', function() {

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<RequestProvider />);
  });

  it('Should render ProviderContext as first child', () => {
    expect(wrapper.first().is(RequestProviderContext)).to.be.true()
  });

  it('Should render to a child function', () => {
    expect(wrapper.find(RequestProviderContext).children(RequestProviderContext).first()).to.be.a('function')
  });

  it('#hasStore should be false when no stateProvider is provided in props', () => {
    const hasStore = wrapper.instance()._hasStore();
    expect(hasStore).to.be.false();
  });

  it('#_getRequestState should return an empty object', () => {
    const state = wrapper.instance()._getRequestState();
    expect(state).to.be.empty();
  });


  it('#_requestSuccessful should set a new request to success with message', () => {
    const id = randomId();
    const message = 'A new successful request message';
    wrapper.instance()._requestSuccessful(id, message);
    const state = wrapper.instance()._getRequestState();

    expect(wrapper.state().data).to.be.equal(state);
    expect(state).to.have.own.property(id);
    expect(state[id]).to.include({ success: true, failed: false, pending: false, id, message });
  });

  it('#_requestFailed should fail a request with message', () => {
    const id = randomId();
    const message = 'Sorry, request failed with message';
    wrapper.instance()._requestFailed(id, message);
    const state = wrapper.instance()._getRequestState();

    expect(wrapper.state().data).to.be.equal(state);
    expect(state).to.have.own.property(id);
    expect(state[id]).to.include({ success: false, failed: true, pending: false, id, message });
  });

 it('#_requestPending should set a request to pending with message', () => {
    const id = randomId();
    const message = 'Sorry, request failed with message';
    wrapper.instance()._requestPending(id, message);
    const state = wrapper.instance()._getRequestState();

    expect(wrapper.state().data).to.be.equal(state);
    expect(state).to.have.own.property(id);
    expect(state[id]).to.include({ success: false, failed: false, pending: true, id, message });
  });


 it('#_removeRequest should remove request from state', () => {
    const id = randomId();
    const message = 'Loading...';
    wrapper.instance()._requestPending(id, message);
    const state = wrapper.instance()._getRequestState();

    expect(wrapper.state().data).to.be.equal(state);
    expect(state).to.have.own.property(id);
    expect(state[id]).to.include({ success: false, failed: false, pending: true, id, message });

    wrapper.instance()._removeRequest(id);
    expect(state).to.be.empty();
 });


  it('#_requestActions Should return selected request actions', () => {
    const actions = wrapper.instance()._requestActions();
    expect(actions)
      .to.have.own.property('success')
      .have.own.property('failed')
      .have.own.property('pending')
      .have.own.property('remove');
    expect(actions.success).to.be.a('function');
    expect(actions.failed).to.be.a('function');
    expect(actions.pending).to.be.a('function');
    expect(actions.remove).to.be.a('function');
  });


  it('#_applyStateChange Should successfully apply changes to request state', () => {
    const id = randomId();
    const transform = (r) => {
      r.message = 'Applying state changes';
      return r;
    };
    wrapper.instance()._applyStateChange(id)(transform);
    const state = wrapper.instance()._getRequestState();

    expect(state).to.have.own.property(id);
    expect(state[id]).to.include({ success: false, failed: false, pending: false, id, message });
  });



});

