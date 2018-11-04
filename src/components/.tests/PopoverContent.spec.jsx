import React from 'react';
import { shallow } from 'enzyme';
import PopoverContent from '../PopoverContent';


describe('<PopoverContent />', () => {
  let message;
  let className;
  let titleClassName;
  let bodyClassName;
  let onClose;
  let wrapper;

  const createWrapper = () => {
    wrapper = shallow(
      <PopoverContent
        message={message}
        className={className}
        titleClassName={titleClassName}
        bodyClassName={bodyClassName}
        onClose={onClose}
      />
    )
  };

  beforeEach(() => {
    createWrapper()
  });

  it('Should create a fully customizable `Popover` content when message has title and body', () => {
    className = 'content-class';
    createWrapper();

    expects(wrapper.is(`div.${className}`)).to.be.true();
    //expects(wrapper.children()).to.be.lengthOf(2);
    //expects(wrapper.children().first().is('div.q-popover-title-failed'))
  });

  it('Should set custom title with no wrapper if title is a valid element', () => {
    titleClassName = "defaultTitleClass";
    message = {
      title: <div className="customTitle">Custom title</div>,
      body: 'A custom message'
    };
    createWrapper();
    expects(wrapper.first().children()).to.be.lengthOf(2);
    expects(wrapper.first().children().first().is('div.customTitle')).to.be.true();
  });

 it('Should set title with default wrapper if title is not a valid element', () => {
   titleClassName = "defaultTitleClass";
    message = {
      title: 'Custom title',
      body: 'A custom message'
    };
    createWrapper();
    expects(wrapper.first().children()).to.be.lengthOf(2);
    expects(wrapper.first().children().first().is(`div.${titleClassName}`)).to.be.true();
  });

  it('Should set custom body with no wrapper if body is a valid element', () => {
    bodyClassName = "defaultBodyClass";
    message = {
      title: <div>Custom title</div>,
      body: <div className="customMessageBody">A custom message</div>
    };
    createWrapper();
    expects(wrapper.first().children()).to.be.lengthOf(2);
    expects(wrapper.first().children().last().is('div.customMessageBody')).to.be.true();
  });

 it('Should set body with default wrapper if body is not a valid element', () => {
   bodyClassName = "defaultBodyClass";
    message = {
      title: 'Custom title',
      body: 'A custom message'
    };
    createWrapper();
    expects(wrapper.first().children()).to.be.lengthOf(2);
    expects(wrapper.first().children().last().is(`div.${bodyClassName}`)).to.be.true();
  });


  it('Should call `onClose` callback on click', () => {
    onClose = jest.fn();
    createWrapper();

    expect(onClose).not.toHaveBeenCalled();
    wrapper.simulate('click');
    expect(onClose).toHaveBeenCalledTimes(1)
  });
});
