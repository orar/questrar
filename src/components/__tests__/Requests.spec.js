import React from 'react';
import { shallow } from 'enzyme';
import { Requests } from '../Requests';
import randomId from '../../utils/randomId';
import { initialRequest } from '../../utils/common';

const LoneChild = ({}) => <div className="loneChild">Im a lone child</div>;

describe('[Component] Requests', function () {
  let id;
  let props;
  let wrapper;
  let requestState;
  let actions = {};

  const createWrapper = () => {
    wrapper = shallow(<Requests {...props} />)
  };

  const createRequestState = () => {
    requestState = Array(5).fill(1)
      .reduce(acc => {
        const id = randomId();
        return { ...acc, [id]: { ...initialRequest, id } }
      }, {});
  };

  beforeEach(() => {
    createRequestState();
    props = { children: <LoneChild />, request: { data: requestState, actions } };
    createWrapper();
  });

  it('Should throw if `id` extractor prop provided is not a function', () => {
    props.id = 'anyId';
    expects(() => createWrapper()).to.throw();
  });

  it('Should provide a default request Id extractor if `id` prop is not set', () => {
    delete props.id;
    createWrapper();
    expects(wrapper.is(LoneChild)).to.be.true();
  });

  xit('Should not update trees if request states have not been updated -o', () => {
    props.fast = true;
    createWrapper();
    const instance = wrapper.instance()
    const shouldUpdate = instance.shouldComponentUpdate(instance.props);
    expects(shouldUpdate).to.be.false();

    const loneId = Object.keys(requestState)[0];
    const loneRequest = JSON.parse(JSON.stringify(requestState[loneId]))
    //loneRequest.pending = true;
    const nextProps = { ...instance.props, request: { data: { ...requestState, [loneId]: loneRequest }, actions } };

    const shouldFastUpdate = instance.shouldComponentUpdate(nextProps);
    console.log(instance.props.request.data);
    console.log(nextProps.request.data);
    expects(shouldFastUpdate).to.be.true();
  });

  it('Should only update tree only if requestState is updated when `fast` prop is set true', () => {
    const loneId = Object.keys(requestState)[0];
    props.fast = true;
    createWrapper();
    wrapper.setProps({ inject: true });
    const instance = wrapper.instance()
    const shouldUpdate = instance.shouldComponentUpdate(instance.props);
    expects(shouldUpdate).to.be.false();
  });

  it('Should update trees if request states is updated', () => {
    const newId = randomId();
    const instance = wrapper.instance()
    const nextProps = { ...props, request: {
      ...props.request,
        data: {
        ...requestState,
          [newId]: {
          ...initialRequest,
            id: newId
        }
      }}};

    const shouldUpdate = instance.shouldComponentUpdate(nextProps)
    expects(shouldUpdate).to.be.true()
  });

  it('Should safely return any child without request id', () => {
    expects(wrapper.is(LoneChild)).to.be.true();
  });

  it('Should safely return any child without request id or id prop', () => {
    const loneId = Object.keys(requestState)[0];
    props.children = [
      <LoneChild />,
      <LoneChild id={loneId} />,
    ];
    props.inject = true;
    createWrapper();
    expects(wrapper.first().props().request).to.be.undefined();
    expects(wrapper.last().props().request.data).to.be.eql(requestState[loneId]);
  })
});
