import React from 'react';
import withRequestSelector from 'src/module/withRequestSelector';
import { shallow } from 'enzyme';
import { RequestConsumerContext } from "../../src/module/context";
import {initialRequest} from "../../src/module/common";

const TestComponent = ({}) => <div>Component</div>;


describe('[withRequestSelector]', () => {
  let idList;
  let component;
  let wrapper;

  let providerStateMock;

  before(() => {
    idList = Array(10).fill(1).map(_ => randomId());
    providerStateMock = {
      data: idList.reduce((acc, id) => {
        const req = Object.assign({ id }, initialRequest);
        return Object.assign({}, acc, { [id]: req });
      }, {}),
      actions: {}
    };

    component = withRequestSelector(TestComponent);

    wrapper = shallow(<component id={idList[0]} />);
  });


  it('#render should render RequestConsumerContext as root element', () => {
    expect(wrapper.dive().first().is(RequestConsumerContext)).to.be.true();
  });


  it('#_getRequest Should extract a single request state given a single id', () => {
    const instance = wrapper.dive().instance();
    const state = instance._getRequest(providerStateMock);

    expect(state).to.be.an('object').that.includes({ id: idList[0] });
  });


});