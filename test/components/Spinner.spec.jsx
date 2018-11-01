import React from 'react';
import { shallow } from 'enzyme';
import Spinner from '../../src/components/Spinner/Spinner';


describe('<Spinner />', () => {
  let size;
  let wrapper;

  const createWrapper = () => {
    wrapper = shallow(
      <Spinner size={size} />
    )
  };

  beforeEach(() => {
    createWrapper();
  });

  it('Should render a loading gear', () => {
    expects(wrapper.is('div.sk-fading-circle')).to.be.true();
    expects(wrapper.children()).to.be.lengthOf(11);
  });

  it('Should set color and size of spinner', () => {
    size = 60;
    createWrapper();

    expects(wrapper.props()).to.deep.include({ style: { width: size, height: size } })
  });
});
