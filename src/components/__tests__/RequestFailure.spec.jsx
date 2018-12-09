import React from 'react';
import { shallow } from 'enzyme';
import RequestFailure from '../RequestFailure';
import randomId from '../../utils/randomId';
import { initialRequest } from '../../utils/common';

const LoneChild = ({}) => <div className="loneChild">Im a lone child</div>;

describe('[Component] RequestFailure', function () {
  let id;
  let props;
  let requestState;
  let actions;
  let wrapper;

  const createWrapper = () => {
    wrapper = shallow(
      <RequestFailure
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
    expects(wrapper.is(LoneChild)).to.be.true();
  });

  it('Should render a custom component created by `onFailure` callback', () => {
    requestState.failed = true;
    props.onFailure = <div className="failFashion">I just lost</div>
    createWrapper();
    expects(wrapper.is('div.failFashion')).to.be.true();
  });

  it('Should render a custom component provided by `onFailure` prop', () => {
    requestState.failed = true;
    props.onFailure = r => <div id={r.data.id}  className="failFashion">I just lost</div>
    createWrapper();
    expects(wrapper.is('div.failFashion')).to.be.true();
    expects(wrapper.props().id).to.be.equal(id);
  });
});
