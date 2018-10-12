import React from 'react';
import withRequest from 'src/module/withRequest';
import { shallow } from 'enzyme';
import { RequestConsumerContext } from "../../src/module/context";
import {initialRequest} from "../../src/module/common";

const TestComponent = ({}) => <div>Component</div>;


describe('[withRequest]', () => {
  let idList;
  let fetchIds;
  let component;
  let singleIdWrapper;
  let wrapper;
  let mulComponent;

  let providerStateMock;

  before(() => {
    idList = Array(10).fill(1).map(_ => randomId());
    fetchIds = idList.slice(1, 4);
    providerStateMock = {
      data: idList.reduce((acc, id) => {
        const req = Object.assign({ id }, initialRequest);
        return Object.assign({}, acc, { [id]: req });
      }, {}),
      actions: {}
    };
    component = withRequest({ id: idList[0] })(TestComponent);
    mulComponent = withRequest({ id: fetchIds })(TestComponent);

    singleIdWrapper = shallow(<component />);
    wrapper = shallow(<mulComponent />)
  });


  it('#render should render RequestConsumerContext as root element', () => {
    expect(singleIdWrapper.dive().first().is(RequestConsumerContext)).to.be.true();
  });


  it('#_getIds Should consolidate all ids to an array', () => {
    const instance = wrapper.dive().instance();
    const ids = instance._getIds();

    expect(ids).to.have.lengthOf(fetchIds.length);
  });

  it('#_getIds Should get a list with only single id', () => {
    const instance = singleIdWrapper.dive().instance();
    const ids = instance._getIds();

    expect(ids).to.have.lengthOf(1);
  });


  it('#_getRequest Should extract a single request state given a single id', () => {
    const instance = singleIdWrapper.dive().instance();
    const state = instance._getRequest(providerStateMock);

    expect(state).to.be.an('object').that.includes({ id: idList[0] });
  });


  it('#_getRequest Should extract specific request states with given ids from whole state', () => {
    const instance = wrapper.dive().instance();
    const states = instance._getRequest(providerStateMock);

    expect(states).to.be.an('object').that.has.all.keys(fetchIds);
  });

});