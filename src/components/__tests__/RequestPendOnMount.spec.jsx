import React from 'react';
import { shallow } from 'enzyme';
import handlePendOnMount from '../RequestPendOnMount';
import randomId from '../../utils/randomId';
import { initialRequest } from '../../utils/common';

const LoneChild = ({}) => <div className="loneChild">Im a lone child</div>;

describe('[Component] RequestPendOnMount', function () {
  let id;
  let props;
  let requestState;
  let actions;
  let wrapper;

  const createWrapper = () => {
    wrapper = shallow(handlePendOnMount(props))
  };

  beforeEach(() => {
    id = randomId();
    requestState = { initialRequest, id };
    actions = {};
    props = {
      request: {data: requestState, actions },
      children: <LoneChild />
    };
    createWrapper()
  });

  it('Should render RequestPending if not handled by `pendOnMount` prop', () => {
    expects(wrapper.is('div.sk-fading-circle')).to.be.true();
  });

  it('Should render children on inject set', () => {
    props.inject = true;
    createWrapper();

    expects(wrapper.is('div.loneChild')).to.be.true();
  });

  it('Should render a custom component created by `pendOnMount` prop', () => {
    props.pendOnMount = <div className="pender">I just won it</div>
    createWrapper();
    expects(wrapper.is('div.pender')).to.be.true();
  });

  it('Should render a custom component provided by `pendOnMount` prop', () => {
    props.pendOnMount = r => <div id={r.data.id}  className="pender">I just lost</div>
    createWrapper();
    expects(wrapper.is('div.pender')).to.be.true();
    expects(wrapper.props().id).to.be.equal(id);
  });

});
