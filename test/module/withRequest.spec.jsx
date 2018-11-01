import React from 'react';
import { shallow } from 'enzyme';
import { randomId } from '../../src/module/helper';
import withRequest from '../../src/module/withRequest';
import { RequestConsumerContext } from '../../src/module/context';
import { initialRequest } from '../../src/module/common';

const TestComponent = () => <div className="test">Component</div>;


describe('[withRequest]', () => {
  let idList;
  let fetchIds;
  let HostComponent;
  let singleIdWrapper;
  let wrapper;
  let MulHostComponent;

  let providerStateMock;

  const mockProviderState = () => {
    const data = idList.reduce((acc, id) => {
      const req = Object.assign({ id }, initialRequest);
      return Object.assign({}, acc, { [id]: req });
    }, {});

    providerStateMock = { data, actions: {} };
  };

  beforeEach(() => {
    idList = Array(10).fill(1).map(randomId);
    fetchIds = idList.slice(1, 4);
    mockProviderState();
    HostComponent = withRequest({ id: idList[0] })(TestComponent);
    MulHostComponent = withRequest({ id: fetchIds })(TestComponent);

    singleIdWrapper = shallow(<HostComponent />);
    wrapper = shallow(<MulHostComponent />)
  });


  it('#render should render RequestConsumerContext as root element', () => {
    expects(singleIdWrapper.first().is(RequestConsumerContext)).to.be.true();
  });


  it('#getIds Should consolidate all ids to an array', () => {
    const instance = wrapper.instance();
    const ids = instance.getIds();

    expects(ids).to.have.lengthOf(fetchIds.length);
  });

  it('#getIds Should get a list with only single id', () => {
    const ids = singleIdWrapper.instance().getIds();

    expects(ids).to.have.lengthOf(1);
  });


  it('#getRequest Should extract a single request state given a single id', () => {
    const instance = singleIdWrapper.instance();
    const state = instance.getRequest(providerStateMock);

    expects(state).to.be.an('object').that.includes({ id: idList[0] });
  });


  it('#getRequest Should extract all request states matching given list of ids from state',
    () => {
      const states = wrapper.instance().getRequest(providerStateMock);

      expects(states).to.be.an('object').that.has.all.keys(fetchIds);
    });

  it('#renderComponent should recreate component with request prop', () => {
    const component = singleIdWrapper.instance().renderComponent(providerStateMock);
    const wrap = shallow(component);

    expects(wrap.is('div')).to.be.true();
  });
});
