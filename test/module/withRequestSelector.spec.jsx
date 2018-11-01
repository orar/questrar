import React from 'react';
import { shallow } from 'enzyme';
import withRequestSelector from '../../src/module/withRequestSelector';
import { randomId } from '../../src/module/helper';
import { RequestConsumerContext } from '../../src/module/context';
import { initialRequest } from '../../src/module/common';

const TestComponent = () => <div>Component</div>;


describe('[withRequestSelector]', () => {
  let idList;
  let HostComponent;
  let wrapper;

  let providerStateMock;

  const mockProviderState = () => {
    const data = idList.reduce((acc, id) => {
      const req = Object.assign({ id }, initialRequest);
      return Object.assign({}, acc, { [id]: req });
    }, {});

    providerStateMock = { data, actions: {} };
  };

  beforeAll(() => {
    idList = Array(10).fill(1).map(randomId);
    mockProviderState();

    HostComponent = withRequestSelector(TestComponent);

    wrapper = shallow(<HostComponent id={idList[0]} />);
  });

  it('#render should render RequestConsumerContext as root', () => {
    expects(wrapper.first().is(RequestConsumerContext)).to.be.true();
  });

  it('#getRequest Should extract a single request state given a single id', () => {
    const state = wrapper.instance().getRequest(providerStateMock);

    expects(state.id).to.be.a('string').that.is.eql(idList[0]);
  });
});
