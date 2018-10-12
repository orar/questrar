import React from 'react';
import { randomId } from "../../src/module/helper";
import Request from 'src/components/Request';
import { shallow } from 'enzyme';
import RequestPending from "src/components/RequestPending/RequestPending";
import {initialRequest} from "src/module/common";
import RequestSuccess from "src/components/RequestSuccess/RequestSuccess";
import RequestError from "src/components/RequestError";

const Requestor = ({}) => <div>Requestor</div>

describe("<Request />", () => {
  let id;
  let requestState;
  let actions;
  let wrapper;


  beforeEach(() => {
    id = randomId();
    requestState = Object.assign({ id }, initialRequest);
    actions = {
      success: () => {},
      pending: () => {},
      failed: () => {},
      remove: () => {},
    };
    wrapper = shallow(
      <Request id={id} request={requestState} actions={actions}>
        <Requestor/>
      </Request>
    )
  });

  it('Should render Requestor on no-factor', () => {
    expect(wrapper.first().is(Requestor)).to.be.true();
  });

  it('Should render a loading component on initialLoading', () => {
    wrapper.setProps({ initialLoading: true });
    expect(wrapper.first().is(RequestPending)).to.be.true();
  });

  it('Should render a loading component on request pending', () => {
    requestState.pending = true;
    wrapper.forceUpdate();
    expect(wrapper.first().is(RequestPending)).to.be.true();
  });

  it('Should inject request state and actions into component', () => {
    wrapper.setProps({ inject: true });
    const request = wrapper.children().first().prop('request');

    expect(request).to.be.an('object').that.has.all.keys(['data', 'actions']);
    expect(request.data).to.include({ id: requestState.id });
  });

  it('Should transform an injected request state prop', () => {
    requestState.pending = true;
    wrapper.setProps({ inject: (r) => ({ loading: r.data.pending }), passivePending: true });
    //wrapper.forceUpdate();
    const loading = wrapper.first().prop('loading');

    expect(loading).to.be.true();
  });

  it('Should render a RequestSuccess on request success', () => {
    requestState.success = true;
    //wrapper.forceUpdate();
    expect(wrapper.first().is(RequestSuccess)).to.be.true();
    expect(wrapper.find(RequestSuccess).children().first().is(Requestor)).to.be.true();
  });

  it('Should render a RequestError on request failed', () => {
    requestState.failed = true;
    //wrapper.forceUpdate();
    expect(wrapper.first().is(RequestError)).to.be.true();
    expect(wrapper.find(RequestError).children().first().is(Requestor)).to.be.true();
  });


});
