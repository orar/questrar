import React from 'react';
import requireReactComponent from '../requireReactComponent';

class Compo extends React.Component {
  render() {
    return <div>A class component</div>
  }
}

const FuncCompo = () => (
  <div>Functional Component</div>
);

describe('[Function] requireReactComponent', () => {
  let classEl;
  let functionalEl;

  beforeEach(() => {
    classEl = <Compo />
    functionalEl = <FuncCompo />
  });

  it('Should pass a class component', () => {
    expects(() => requireReactComponent(Compo)).to.not.throw()
  });

  it('Should pass a stateless component', () => {
    expects(() => requireReactComponent(FuncCompo)).to.not.throw()
  });

  it('Should thow on no component as argument', () => {
    expects(() => requireReactComponent()).to.throw()
  });

  it('Should thow on any other value as argument apart from components', () => {
    expects(() => requireReactComponent(434)).to.throw()
  });

  it('Should thow on class elements', () => {
    expects(() => requireReactComponent(classEl)).to.throw()
  });

  it('Should thow on stateless elements', () => {
    expects(() => requireReactComponent(functionalEl)).to.throw()
  });
});
