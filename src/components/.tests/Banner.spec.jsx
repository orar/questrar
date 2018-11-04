import React from 'react';
import { shallow } from 'enzyme';
import Banner from '../Banner';

describe('<Banner />', () => {
  let message;
  let defaultMessage;
  let className;
  let wrapper;

  const createWrapper = () => {
    wrapper = shallow(
      <Banner
        message={message}
        defaultMessage={defaultMessage}
        className={className}
      />
    )
  };

  beforeEach(() => {
    createWrapper();
  });

  it('Should show message', () => {
    message = 'Show this message';
    createWrapper();
    expects(wrapper.text()).to.be.equal(message)
  });

  it('Should show a default message if no message is provided', () => {
    defaultMessage = 'Show this message';
    createWrapper();
    expects(wrapper.text()).to.be.equal(defaultMessage)
  });

  it('Should not wrap a custom wrapped message', () => {
    message = <div className="customWrapped">Show this message</div>;
    createWrapper();
    expects(wrapper.is('div.customWrapped')).to.be.true();
  });

  it('Should show a title and body when message is formatted', () => {
    message = {
      title: 'A simple title',
      body: 'Nice body'
    };
    createWrapper();
    expects(wrapper.children()).to.have.lengthOf(2)
  });

  it('Should show nothing if there is no title or body', () => {
    message = {
      header: 'A simple title',
      footer: 'Nice body'
    };
    createWrapper();
    expects(wrapper.children()).to.be.empty()
  });

});
