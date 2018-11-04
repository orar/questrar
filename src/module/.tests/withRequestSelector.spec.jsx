import React from 'react';
import { shallow } from 'enzyme';
import withRequestSelector from '../withRequestSelector';
import { randomId } from '../helper';
import { RequestConsumerContext } from '../context';
import { initialRequest } from '../common';

const TestComponent = (props) => <div {...props}>Component</div>;


describe('[withRequestSelector]', () => {
  let idList;
  let HostComponent;
  let wrapper;
  let actions;
  let providerStateMock;

  const mockProviderState = () => {
    const data = idList.reduce((acc, id) => {
      const req = Object.assign({ id }, initialRequest);
      return Object.assign({}, acc, { [id]: req });
    }, {});

    providerStateMock = { data, actions: {} };
  };

  const createActions = () => {
    actions = {
      success: jest.fn(),
      pending: jest.fn(),
      failed: jest.fn(),
      remove: jest.fn(),
      dirty: jest.fn(),
      clean: jest.fn(),
    };
  };

  beforeAll(() => {
    idList = Array(10).fill(1).map(randomId);
    mockProviderState();
    createActions()

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

  it('#getRequest Should create a single request state given a single id', () => {
    const component = wrapper.instance().renderComponent({ data: providerStateMock, actions });
    const scomponent = shallow(component);

    expects(scomponent.prop('request')).to.include({ id: idList[0] });
  });


});
