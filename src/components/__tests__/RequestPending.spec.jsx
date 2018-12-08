import React from 'react';
import { shallow } from 'enzyme';
import RequestPending from '../RequestPending';
import randomId from '../../utils/randomId';
import { initialRequest } from '../../utils/common';
import Spinner from '../Spinner';

const LoneChild = ({}) => <div className="loneChild">Im a lone child</div>;

describe('[Component] RequestPending', function () {
  let id;
  let props;
  let requestState;
  let actions;
  let wrapper;

  const createWrapper = () => {
    wrapper = shallow(
      <RequestPending
        request={{data: requestState, actions }}
        children={<LoneChild />}
        {...props}
      />
    )
  };

  beforeEach(() => {
    id = randomId();
    requestState = { initialRequest, id };
    actions = {};
    props = {};
    createWrapper()
  });

  it('Should render children if not handled', () => {
    expects(wrapper.is(Spinner)).to.be.true();
  });

  it('Should render children on inject set', () => {
    props.inject = true;
    createWrapper();

    expects(wrapper.is(LoneChild)).to.be.true();
  });

  it('Should render a custom component created by `RequestPending` callback', () => {
    props.onPending = <div className="pender">I just won it</div>
    createWrapper();
    expects(wrapper.is('div.pender')).to.be.true();
  });

  it('Should render a custom component provided by `RequestPending` prop', () => {
    props.onPending = r => <div id={r.data.id}  className="pender">I just lost</div>
    createWrapper();
    expects(wrapper.is('div.pender')).to.be.true();
    expects(wrapper.props().id).to.be.equal(id);
  });

});
