import React from 'react';
import getComponentName from '../getComponentName';

class Compo extends React.Component {
  render() {
    return <div>A nice compo</div>
  }
}

const FuncCompo = () => (
  <div>Functional Compo</div>
);

describe('[Function] getComponentName', () => {

  it('Should get name of class component', () => {
    expects(getComponentName(Compo)).to.be.a('string').that.is.equal('Compo')
  });

  it('Should get name of stateless component', () => {
    expects(getComponentName(FuncCompo)).to.be.a('string').that.is.equal('FuncCompo')
  });
});
