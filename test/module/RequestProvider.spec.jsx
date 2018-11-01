import React from 'react';
import { shallow } from 'enzyme';
import RequestProvider from '../../src/module/RequestProvider';
import { RequestProviderContext } from '../../src/module/context';
import { randomId } from '../../src/module/helper';


describe('<RequestProvider />', () => {
  let wrapper;
  const make = () => (
    shallow(<RequestProvider />)
  );

  beforeEach(() => {
    wrapper = make();
  });

  it('Should render ProviderContext on the component tree', () => {
    expects(wrapper.first().is(RequestProviderContext)).to.be.true();
    // expects(wrapper.type()).to.be.a(RequestProviderContext);
  });

  it('#hasStore should be false when no stateProvider is provided in props', () => {
    const hasStore = wrapper.instance().hasStore();
    expects(hasStore).to.be.false();
  });

  it('#getRequestState should  be empty on start', () => {
    const state = wrapper.instance().getRequestState();
    expects(state).to.be.empty();
  });


  it('#requestSuccessful should set a request to success with message', () => {
    const id = randomId();
    const message = 'A new successful request message';
    wrapper.instance().requestSuccessful(id, message);
    const state = wrapper.instance().getRequestState();

    expects(wrapper.state().data).to.be.eql(state);
    expects(state).to.have.own.property(id);
    expects(state[id]).to.own.include({ success: true, failed: false, pending: false, id, message })
  });

  it('#requestFailed should a request to failed with message', () => {
    const id = randomId();
    const message = 'Sorry, request failed with message';
    wrapper.instance().requestFailed(id, message);
    const state = wrapper.instance().getRequestState();

    expects(wrapper.state().data).to.be.eql(state);
    expects(state).to.have.own.property(id);
    expects(state[id]).to.own.include({ success: false, failed: true, pending: false, id, message })
  });

  it('#requestPending should set a request to pending with message', () => {
    const id = randomId();
    const message = 'Sorry, request failed with message';
    wrapper.instance().requestPending(id, message);
    const state = wrapper.instance().getRequestState();

    expects(wrapper.state().data).to.be.eql(state);
    expects(state).to.have.own.property(id);
    expects(state[id]).to.own.include({ success: false, failed: false, pending: true, id, message })
  });


  it('#removeRequest should remove request from state', () => {
    const id = randomId();
    const message = 'Loading...';
    wrapper.instance().requestPending(id, message);
    const state = wrapper.instance().getRequestState();

    expects(wrapper.state().data).to.be.eql(state);
    expects(state).to.have.own.property(id);
    expects(state[id]).to.own.include({ success: false, failed: false, pending: true, id, message })

    wrapper.instance().removeRequest(id);
    const newState = wrapper.instance().getRequestState();
    expects(newState).to.be.empty();
  });


  it('#requestActions Should return request actions', () => {
    const actions = wrapper.instance().requestActions();

    expects(actions).to.have.own.property('success').that.is.a('function');
    expects(actions).to.have.own.property('failed').that.is.a('function');
    expects(actions).to.have.own.property('pending').that.is.a('function');
    expects(actions).to.have.own.property('remove').that.is.a('function');
    expects(actions).to.have.own.property('dirty').that.is.a('function');
    expects(actions).to.have.own.property('clean').that.is.a('function');
  });


  it('#applyStateChange Should successfully apply changes to request state', () => {
    const id = randomId();
    const message = 'Applying state changes';
    const transform = (r) => {
      const t = r;
      t.message = message;
      return t;
    };
    wrapper.instance().applyStateChange(id)(transform);
    const state = wrapper.instance().getRequestState();

    expects(state).to.have.own.property(id);
    expects(state[id]).to.own.include({
      success: false,
      failed: false,
      pending: false,
      id,
      message,
    })
  });
});
