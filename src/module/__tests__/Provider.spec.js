import React from 'react';
import { shallow, mount } from 'enzyme';
import Provider from '../Provider';
import randomId from '../../utils/randomId';
import { initialRequest } from '../../utils/common';
import Context, { RequestProviderContext } from '../context';
import { mockStateProvider } from './mock';

class ProviderChild extends React.Component {
  static contextType = Context;

  render(){
    return (<div>Child of a provider</div>);
  }
}

describe('[Component] Provider', () => {
  let id;
  let stateProvider;
  let wrapper;

  const createProvider = (wrap = shallow) => {
    wrapper = wrap(
      <Provider stateProvider={stateProvider}>
        <ProviderChild />
      </Provider>
    )
  };

  beforeEach(() => {
    id = randomId();
    stateProvider = mockStateProvider({ data: { ...initialRequest, id } });
    createProvider();
  });

  it('Should create a context tree', () => {
    expects(wrapper.is(RequestProviderContext)).to.be.true()
  });

  it('Should provide a state provider prop to context provider', () => {
    expects(wrapper.props().value).to.be.eql(stateProvider);
  });

  it('Should provide a state provider object to context tree', () => {
    createProvider(mount);
    expects(wrapper.children().first().instance().context).to.be.eql(stateProvider)
  });
});
