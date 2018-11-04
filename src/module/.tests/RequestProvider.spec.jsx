import React from 'react';
import { shallow } from 'enzyme';
import RequestProvider from '../RequestProvider';
import { RequestProviderContext } from '../context';
import { randomId } from '../helper';
import { CLEAN, DIRTY, FAILED, PENDING, REMOVE, SUCCESS } from '../common';


describe('<RequestProvider />', () => {
  let wrapper;
  let stateProvider;

  const make = () => (
    wrapper = shallow(<RequestProvider stateProvider={stateProvider} />)
  );

  const makeStoreProvider = () => {
    stateProvider = {
      getState: jest.fn(),
      updateRequest: jest.fn(),
      observe: jest.fn(),
      release: jest.fn(),
      replace: jest.fn(),
      path: 'unknownPath'
    };
    make();
  };

  beforeEach(() => {
    make();
  });

  afterEach(() => {
    stateProvider = null;
  });

  it('Should observe state changes if store has store', () => {
    makeStoreProvider();
    expect(stateProvider.observe).toHaveBeenCalledTimes(1);
  });

  it('Should force update the component tree on store state changes', () => {
    makeStoreProvider();
    const instance = wrapper.instance();
    const forceUpdate = spyOn(instance, 'forceUpdate');
    instance.updateContextTree(true);

    expect(forceUpdate).toHaveBeenCalledTimes(1);
  });

  it('Should render ProviderContext on the component tree', () => {
    expects(wrapper.first().is(RequestProviderContext)).to.be.true();
  });

  it('#hasStore should be false when no stateProvider is provided in props', () => {
    expects(wrapper.instance().hasStore()).to.be.false();
  });

  it('#hasStore should return true when stateProvider is provided in props', () => {
    makeStoreProvider();
    expects(wrapper.instance().hasStore()).to.be.true();
  });

  it('#getRequestState should  be empty on start', () => {
    const state = wrapper.instance().getRequestState();
    expects(state).to.be.empty();
  });

  it('#getRequestState should  call stateProvider `getState` if there is store', () => {
    makeStoreProvider();
    wrapper.instance().getRequestState();
    expect(stateProvider.getState).toHaveBeenCalled();// 1
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

  it('#requestSuccessful should call `stateProvider.updateRequest` if it has store', () => {
    makeStoreProvider();
    const id = randomId();
    const message = 'A new successful request message';
    wrapper.instance().requestSuccessful(id, message);

    expect(stateProvider.updateRequest).toHaveBeenNthCalledWith(1, { id, status: SUCCESS, message })
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

  it('#requestFailed should call `stateProvider.updateRequest` if it has store', () => {
    makeStoreProvider();
    const id = randomId();
    const message = 'A new successful request message';
    wrapper.instance().requestFailed(id, message);

    expect(stateProvider.updateRequest).toHaveBeenNthCalledWith(1, { id, status: FAILED, message })
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

  it('#requestPending should call `stateProvider.updateRequest` if it has store', () => {
    makeStoreProvider();
    const id = randomId();
    const message = 'A new successful request message';
    wrapper.instance().requestPending(id, message);

    expect(stateProvider.updateRequest).toHaveBeenNthCalledWith(1, { id, status: PENDING, message })
  });

  it('#requestClean should set a request to clean state', () => {
    const id = randomId();
    wrapper.instance().requestClean(id);
    const state = wrapper.instance().getRequestState();

    expects(wrapper.state().data).to.be.eql(state);
    expects(state).to.have.own.property(id);
    expects(state[id]).to.own.include({ clean: true, id })
  });

  it('#requestClean should call `stateProvider.updateRequest` if it has store', () => {
    makeStoreProvider();
    const id = randomId();
    wrapper.instance().requestClean(id);

    expect(stateProvider.updateRequest).toHaveBeenNthCalledWith(1, { id, status: CLEAN })
  });

  it('#requestDirty should set a request to clean state', () => {
    const id = randomId();
    wrapper.instance().requestDirty(id);
    const state = wrapper.instance().getRequestState();

    expects(wrapper.state().data).to.be.eql(state);
    expects(state).to.have.own.property(id);
    expects(state[id]).to.own.include({ clean: false, id })
  });

  it('#requestDirty should call `stateProvider.updateRequest` if it has store', () => {
    makeStoreProvider();
    const id = randomId();
    wrapper.instance().requestDirty(id);

    expect(stateProvider.updateRequest).toHaveBeenNthCalledWith(1, { id, status: DIRTY })
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

  it('#removeRequest should call `stateProvider.updateRequest` if it has store', () => {
    makeStoreProvider();
    const id = randomId();
    const message = 'A new successful request message';
    wrapper.instance().removeRequest(id, message);

    expect(stateProvider.updateRequest).toHaveBeenNthCalledWith(1, { id, status: REMOVE })
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

  it('Should release store and it resouces on unmount', () => {
    makeStoreProvider();
    wrapper.unmount();
    expect(stateProvider.release).toHaveBeenCalledTimes(1)
  });
});
