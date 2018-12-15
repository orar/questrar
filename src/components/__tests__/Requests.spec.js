import React from 'react';
import { shallow } from 'enzyme';
import { Requests } from '../Requests';
import { initialRequest } from '../../utils/common';
import { makeRandomIds, mockProviderRequestState } from '../../__tests__/RequestMock';

const LoneChild = ({}) => <div className="loneChild">Im a lone child</div>;

describe('[Component] Requests', function () {
  let id;
  let idList;
  let props;
  let wrapper;
  let requestState;
  let actions = {};

  const createWrapper = () => {
    wrapper = shallow(<Requests  {...props} />)
  };

  const createRequestState = () => {
    requestState = mockProviderRequestState(idList)
  };

  beforeEach(() => {
    idList = makeRandomIds();
    createRequestState();
    props = {
      id: props => props.id,
      children: idList.map(id => <LoneChild id={id} />),
      request: { data: requestState, actions },
      inject: true,
    };
    createWrapper();
  });

  it('Should throw if `id` extractor prop provided is not a function', () => {
    props.id = 'anyId';
    expects(() => createWrapper()).to.throw();
  });

  describe('[Function] createSubTree', () => {

    it('Should not create a tree if child is not a React element ', () => {
      const childEl = 'element';
      const el = wrapper.instance().createSubTree(childEl);
      expects(el).to.be.equal(childEl)
    });

    it('Should set trees to cache if skipOldTrees prop is set truthy', () => {
      props.skipOldTrees = true;
      createWrapper();
      const cache = wrapper.instance().cache;

      expects(cache.requests.size).to.be.equal(idList.length)
    });

    it('Should not set trees to cache if skipOldTrees prop is not set or false', () => {
      props.skipOldTrees = false;
      createWrapper();
      const cache = wrapper.instance().cache;

      expects(cache.requests.size).to.be.equal(0)
    });
  });

  it('Should safely return any child without setting to cache if could not extract id from child', () => {
    const loneId = Object.keys(requestState)[0];
    props.children = [
      <LoneChild />,
      <LoneChild id={loneId} />,
    ];
    props.inject = true;
    createWrapper();
    expects(wrapper.first().props().request).to.be.undefined();
    expects(wrapper.last().props().request.data).to.be.eql(requestState[loneId]);
  });

});
