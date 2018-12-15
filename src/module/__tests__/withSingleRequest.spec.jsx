import React from 'react';
import { shallow, mount } from 'enzyme';
import withSingleRequest from '../withSingleRequest';
import Provider from '../Provider';
import { makeRandomIds, mockProviderRequestState } from '../../__tests__/RequestMock';

const TestComponent = ({}) => <div>Component</div>;


describe('[Component] withSingleRequest', () => {
  let id;
  let idList;
  let HostComponent;
  let wrapper;
  let providerState;
  let stateProvider;
  let unsubscribe;

  const mockProviderState = () => {
    providerState = mockProviderRequestState(idList)
  };

  const makeStateProvider = () => {
    unsubscribe  = jest.fn();
    stateProvider = {
      name: 'Test.State.Provider',
      getState: jest.fn(() => providerState),
      updateRequest: jest.fn(),
      observe: jest.fn(() => unsubscribe)
    };
  };


  const createWrapper = (wrap, noProvider) => {
    wrapper = noProvider ?
      wrap(<HostComponent id={idList[0]} stateProvider={stateProvider} />) :
      wrap(
        <Provider stateProvider={stateProvider}>
          <HostComponent id={idList[0]} stateProvider={stateProvider} />
        </Provider>
      )
  };

  beforeAll(() => {
    idList = makeRandomIds();
    id = idList[0];
    mockProviderState();
    makeStateProvider();

    HostComponent = withSingleRequest(TestComponent);
  });

  it('Should throw if wrapped component is not a React component', () => {
    expects(() => withSingleRequest()).to.throw();
  });

  it('Should receive and set stateProvider before mount', () => {
    createWrapper(mount);
    const instance = wrapper.children().first().instance();

    expects(instance.context).to.be.eql(stateProvider);
    expects(instance.provider).to.be.eql(stateProvider).which.is.eql(instance.context);
  });

  it('Should observe request states on mount', () => {
    makeStateProvider();
    createWrapper(mount, true);
    createWrapper(mount, false);
    const instance = wrapper.children().first().instance();

    expect(stateProvider.observe).toHaveBeenCalledTimes(2)
    expect(instance.release).toBeDefined();
  });

  it('#createBookkeeper Should create a bookkeeper instance', () => {
    createWrapper(mount);
    const instance = wrapper.children().first().instance();
    instance.bookkeeper = undefined;
    expects(instance.bookkeeper).to.be.undefined();
    instance.createBookkeeper();
    expects(instance.bookkeeper).to.not.be.undefined();
  });

  it('#createProvider Should set a stateProvider instance to provider property', () => {
    createWrapper(mount);
    const instance = wrapper.children().first().instance();
    instance.provider = undefined;
    expects(instance.provider).to.be.undefined();
    instance.createProvider();
    expects(instance.provider).to.not.be.undefined();
  });

  describe('[Function] shouldComponentUpdate', () => {
    it('Should call bookkeeper `checkForUpdate`', () => {
      createWrapper(mount);
      const instance = wrapper.children().first().instance();
      const shouldUpdateSpy = jest.spyOn(instance.bookkeeper, 'checkForUpdate');
      instance.setState({ id: 'update'});

      expect(shouldUpdateSpy).toHaveBeenCalledTimes(1);
      expect(instance.bookkeeper.shouldUpdate).toBeFalsy();
    })
  });

  describe('[Function] componentWillUnmount', () => {
    it('Should release state provider resources on unmount', () => {
      createWrapper(mount);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('Should clear bookkeeper resources on unmount', () => {
      createWrapper(mount);
      const instance = wrapper.children().first().instance();
      const clearSelfSpy = jest.spyOn(instance.bookkeeper, 'clearSelf');
      wrapper.unmount();
      expect(clearSelfSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('[Function] render', () => {
    it('Should render children as root', () => {
      createWrapper(shallow, true);
      expects(wrapper.is(TestComponent)).to.be.true();
    });

    it('Should provide request prop to children component', () => {
      createWrapper(shallow, true);
      expects(wrapper.props().request).to.be.an('object');
      expects(wrapper.props().request.data).to.deep.include({ id: idList[0] })
    })
  });
});
