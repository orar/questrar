import React from 'react';
import { shallow } from 'enzyme';
import RequestPending from '../../src/components/RequestPending';
import Spinner from '../../src/components/Spinner/Spinner';


describe('<RequestPending />', () => {
  let color;
  let size;
  let wrapper;

  const createWrapper = () => {
    wrapper = shallow(
      <RequestPending color={color} size={size} />
    )
  };

  beforeEach(() => {
    createWrapper();
  });

  it('Should render a loading gear', () => {
    expects(wrapper.is('div.pendingContainer')).to.be.true();
    expects(wrapper.children().first().is(Spinner)).to.be.true()
  });

  it('Should be able to set size of spinner by prop', () => {
    size = 30;
    createWrapper();
    expects(wrapper.children().first().prop('size')).to.be.equal(size);
  });
});
