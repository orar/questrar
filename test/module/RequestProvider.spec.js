import React from 'react';
import Enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from '';
import RequestProvider from 'module/RequestProvider';



describe('[RequestProvider]', function() {


  it('#hasStore Should be false when no store is provided', () => {
    const wrapper = mount(<RequestProvider />);
    const hasStore = spy(wrapper.hasStore);
    expect(hasStore).to.be.true;
  });

  it('#_getRequestState Should return an empty object', () => {
    const wrapper = mount(<RequestProvider />);
    const hasStore = spy(wrapper.hasStore);
    expect(hasStore).to.be.true;
  });



  it('#render Should render wrapped in a context provider', () => {
    const wrapper = mount(<RequestProvider />);
    const provider = wrapper.find(0)
    expect(provider).to.be.a('');
  });

  it('#run componentDidMount', () => {
    spy(RequestProvider.prototype.componentDidMount)
    const provider = mount(<RequestProvider />);
    expect(RequestProvider.prototype.componentDidMount()).to.have.property('callCount', 1);
  });

});

