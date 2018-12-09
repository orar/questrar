import React from 'react';
import { shallow, mount } from 'enzyme';
import randomId from '../../utils/randomId';
import withRequest from '../withRequest';
import Provider from '../Provider';
import { mockProviderRequestState } from './mock';

const TestComponent = () => <div className="test">Component</div>;

describe('[Component] withRequest', () => {
  let idList;
  let firstId;
  let selectedIds;

  let HostComponent;
  let MulHostComponent;

  let singleIdWrapper;
  let wrapper;

  let providerState;
  let stateProvider;

  let unsubscribe;

  const mockProviderState = () => {
    const data = mockProviderRequestState(idList);
    providerState = { data, actions: {} };

  };

  const mockStateProvider = () => {
    unsubscribe  = jest.fn();
    stateProvider = {
      name: 'Test.State.Provider',
      getState: jest.fn(() => providerState),
      updateRequest: jest.fn(),
      observe: jest.fn(() => unsubscribe)
    };
  };

  const createSingleIdWrapper = (wrap, noProvider) => {
    singleIdWrapper = noProvider ?
      wrap(<HostComponent stateProvider={stateProvider} />) :
      wrap(
      <Provider stateProvider={stateProvider}>
        <HostComponent stateProvider={stateProvider} />
      </Provider>
    )
  };

  const createManyIdWrapper = (wrap, noProvider) => {
    wrapper = noProvider ?
      wrap(<HostComponent stateProvider={stateProvider} />) :
      wrap(
      <Provider stateProvider={stateProvider}>
        <HostComponent />
      </Provider>
    );
  };

  beforeEach(() => {
    idList = Array(10).fill(1).map(randomId);
    firstId = idList[1];
    selectedIds = idList.slice(3, 6);

    mockProviderState();
    mockStateProvider();
    HostComponent = withRequest({ id: idList[0] })(TestComponent);
    MulHostComponent = withRequest({ id: selectedIds })(TestComponent);
  });

  it('Should throw if wrapped component is not a react component', () => {
    expects(() => withRequest({ id: idList[0] })()).to.throw();
  });

  it('Should receive and set stateProvider before mount', () => {
    createSingleIdWrapper(mount);
    const instance = singleIdWrapper.children().first().instance();

    expects(instance.context).to.be.eql(stateProvider);
    expects(instance.provider).to.be.eql(stateProvider).which.is.eql(instance.context);
  });

  it('Should render wrapped component as root Component', () => {
    createSingleIdWrapper(mount);
    expects(singleIdWrapper.children().children().is(TestComponent)).to.be.true();
  });

  it('Should observe request states on mount', () => {
    createSingleIdWrapper(mount, true);
    createSingleIdWrapper(mount, false);
    createManyIdWrapper(mount, false);
    createManyIdWrapper(mount, true);
    expect(stateProvider.observe).toHaveBeenCalledTimes(4)
  });

  it('#createBookkeeper Should create a bookkeeper instance', () => {
    createSingleIdWrapper(mount);
    const instance = singleIdWrapper.children().first().instance();
    instance.bookkeeper = undefined;
    expects(instance.bookkeeper).to.be.undefined();
    instance.createBookkeeper();
    expects(instance.bookkeeper).to.not.be.undefined();
  });

  it('#createProvider Should set a stateProvider instance to provider property', () => {
    createSingleIdWrapper(mount);
    const instance = singleIdWrapper.children().first().instance();
    instance.provider = undefined;
    expects(instance.provider).to.be.undefined();
    instance.createProvider();
    expects(instance.provider).to.not.be.undefined();
  });

  describe('[Function] getIds', () => {
    it('Should consolidate `props.id` and a single `options.id`' +
      ' when `mergeIdSources` is set true', () => {
      const randId = randomId();
      const WrappedTest = withRequest({ id: idList[0], mergeIdSources: true })(TestComponent);
      const wrappedTest = shallow(<WrappedTest id={randId} stateProvider={stateProvider} />);

      const ids = wrappedTest.instance().getIds(wrappedTest.props());

      expects(ids).to.have.lengthOf(2);
      expects(ids).to.include(idList[0], randId);
    });

    it('Should consolidate `props.id` and multi `options.id`' +
      ' when `mergeIdSources` is set true', () => {
      const randId = randomId();
      const WrappedTest = withRequest({ id: idList, mergeIdSources: true })(TestComponent);
      const wrappedTest = shallow(<WrappedTest id={randId}  stateProvider={stateProvider} />);

      const ids = wrappedTest.instance().getIds(wrappedTest.props());

      expects(ids).to.have.lengthOf(idList.length + 1);
      expects(ids).to.include(randId);
    });

    it('Should be able to generate ids from props' +
      ' given that `options.id` is a function', () => {
      const randId = randomId();
      const getId = props => props.version;
      const WrappedTest = withRequest({ id: getId, mergeIdSources: true })(TestComponent);
      const wrappedTest = shallow(<WrappedTest version={2323} id={randId} stateProvider={stateProvider} />);

      const ids = wrappedTest.instance().getIds(wrappedTest.props());
      expects(ids).to.have.lengthOf(2);
      expects(ids).to.include(2323, randId)
    });
  });

  describe('[Function] shouldComponentUpdate', () => {
    it('Should call bookkeeper `checkForUpdate`', () => {
      createSingleIdWrapper(mount);
      const instance = singleIdWrapper.children().first().instance();
      const shouldUpdateSpy = jest.spyOn(instance.bookkeeper, 'checkForUpdate');
      instance.setState({ id: 'update'});

      // Called again in componentWillUpdate
      expect(shouldUpdateSpy).toHaveBeenCalledTimes(2);
    })
  });

  describe('[Function] componentWillUnmount', () => {
    it('Should release state provider resources on unmount', () => {
      createSingleIdWrapper(mount);
      singleIdWrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('Should clear bookkeeper resources on unmount', () => {
      createSingleIdWrapper(mount);
      const instance = singleIdWrapper.children().first().instance();
      const clearSelfSpy = jest.spyOn(instance.bookkeeper, 'clearSelf');
      singleIdWrapper.unmount();
      expect(clearSelfSpy).toHaveBeenCalledTimes(1);
    });
  });


  describe('[Function] render', () => {
    it('Should render Children as root element', () => {
      createSingleIdWrapper(shallow, true);
      expects(singleIdWrapper.is(TestComponent)).to.be.true()
    });

    it('Should render Children as root element with request prop', () => {
      createSingleIdWrapper(shallow, true);
      expects(singleIdWrapper.props().request).to.be.an('object')
    });
  });
});
