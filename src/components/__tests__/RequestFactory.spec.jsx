import React from 'react';
import { shallow } from 'enzyme';
import RequestFactory from '../RequestFactory';
import { initialRequest } from '../../utils/common';
import randomId from '../../utils/randomId';

const LoneChild = ({}) => <div className="loneChild">Im a lone child</div>;

describe('[Function] RequestFactory', () => {
  let id;
  let props;
  let requestState;
  let actions;

  beforeEach(() => {
    id = randomId();
    actions = {};
    requestState = { ...initialRequest, id };
    props = { children: <LoneChild />, request: { data: requestState, actions }}
  });

  it('Should return children if not handled by any request state', () => {
    const req = RequestFactory(props);
    const wrapper = shallow(req);

    expects(req.type.toString()).to.include('LoneChild');
    expects(wrapper.is('div.loneChild')).to.be.true();
  });

  it('Should handle a failed request', () => {
    requestState.failed = true;
    const req = RequestFactory(props);
    const wrapper = shallow(req);

    expects(req.type.toString()).to.include('LoneChild');
    expects(wrapper.is('div.loneChild')).to.be.true();
  });

  it('Should handle a pending request', () => {
    requestState.pending = true;
    const req = RequestFactory(props);

    expects(req.type.toString()).to.include('Spinner');
  });

  it('Should handle a success request', () => {
    requestState.success = true;
    const req = RequestFactory(props);
    const wrapper = shallow(req);

    expects(req.type.toString()).to.include('LoneChild');

    expects(wrapper.is('div.loneChild')).to.be.true();
  });

  it('Should handle a pendOnMount request', () => {
    props.pendOnMount = true;
    const req = RequestFactory(props);

    expects(req.type.toString()).to.include('Spinner');
  });
});
