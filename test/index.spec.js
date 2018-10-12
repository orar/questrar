import React from 'react';
import { Request, RequestProvider, withRequest } from 'src/index';


describe('(Entry) index', () => {

  it('Should export Request as a component', () => {
    expect(Request).to.be.instanceOf(React.Component)
  });

  it('Should export RequestProvider as a Component', () => {
    expect(RequestProvider).to.be.instanceOf(React.PureComponent)
  });

  it('Should export withRequest as a function', () => {
    expect(withRequest).to.be.a('function');
  });

});