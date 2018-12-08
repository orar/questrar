import React from 'react';
import { shallow } from 'enzyme';
import RequestSuccess from '../RequestSuccess';
import randomId from '../../utils/randomId';
import { initialRequest } from '../../utils/common';

const LoneChild = ({}) => <div className="loneChild">Im a lone child</div>;

describe('[Component] RequestSuccess', function () {
  let id;
  let props;
  let requestState;
  let actions;
  let wrapper;

  const createWrapper = () => {
    wrapper = shallow(
      <RequestSuccess
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

  it('Should render a custom component created by `onSuccess` callback', () => {
    requestState.success = true;
    props.onSuccess = <div className="winGeek">I just won it</div>
    createWrapper();
    expects(wrapper.is('div.winGeek')).to.be.true();
  });

  it('Should render a custom component provided by `onSuccess` prop', () => {
    requestState.success = true;
    props.onSuccess = r => <div id={r.data.id}  className="winGeek">I just lost</div>
    createWrapper();
    expects(wrapper.is('div.winGeek')).to.be.true();
    expects(wrapper.props().id).to.be.equal(id);
  });
});
