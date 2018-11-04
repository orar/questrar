import React from 'react';
import { shallow } from 'enzyme';
import { randomId } from '../helper';
import withRequest from '../withRequest';
import { RequestConsumerContext } from '../context';
import { initialRequest } from '../common';

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

  it('#getIds Should get a list of a single id', () => {
    const ids = singleIdWrapper.instance().getIds();

    expects(ids).to.have.lengthOf(1);
  });

  it('#getIds Should consolidate all ids to an array', () => {
    const instance = wrapper.instance();
    const ids = instance.getIds();

    expects(ids).to.have.lengthOf(fetchIds.length);
  });

  it('#getIds Should consolidate `props.id` and a single `options.id`' +
    ' when `mergeIdSources` is set true', () => {
    const randId = randomId();
    const ConsoComponent = withRequest({ id: idList[0], mergeIdSources: true })(TestComponent);
    const consoWrap = shallow(<ConsoComponent id={randId} />);

    const ids = consoWrap.instance().getIds();

    expects(ids).to.have.lengthOf(2);
    expects(ids).to.include(idList[0], randId);
  });

  it('#getIds Should consolidate `props.id` and multi `options.id`' +
    ' when `mergeIdSources` is set true', () => {
    const randId = randomId();
    const ConsoComponent = withRequest({ id: idList, mergeIdSources: true })(TestComponent);
    const consoWrap = shallow(<ConsoComponent id={randId} />);

    const ids = consoWrap.instance().getIds();

    expects(ids).to.have.lengthOf(idList.length + 1);
    expects(ids).to.include(randId);
  });

  it('#getIds Should be able to generate ids from props' +
    ' given that `options.id` is a function', () => {
    const randId = randomId();
    const getId = props => Object.keys(props).length.toString();
    const ConsoComponent = withRequest({ id: getId, mergeIdSources: true })(TestComponent);
    const consoWrap = shallow(<ConsoComponent id={randId} />);

    const ids = consoWrap.instance().getIds();
    expects(ids).to.have.lengthOf(2);
    expects(ids).to.include('1', randId)
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

  it('#getRequest Should provide a fresh requestState for a list of a single new id', () => {
    const unknownId = 'unknownId';
    const instance = wrapper.instance();
    instance.getIds = jest.fn(() => [unknownId]);
    const state = wrapper.instance().getRequest(providerStateMock);

    expects(state).to.be.an('object').that.is.eql({...initialRequest, id: unknownId })
  });

  it('#renderComponent should recreate component with request prop', () => {
    const component = singleIdWrapper.instance().renderComponent(providerStateMock);
    const wrap = shallow(component);

    expects(wrap.is('div')).to.be.true();
  });
});
