// @flow
import React, { PureComponent } from 'react';
import type { Node } from 'react';
import PropTypes from 'prop-types';
import { RequestProviderContext } from './context';
import type { StateProvider } from '../index';

type Props = {
  stateProvider: StateProvider,
  children: Node
}

/**
 * Provides request state provider via context to its sub component tree
 *
 * ```
 *  const optionalStateProvider = createStateProvider(reduxStore);
 *
 *  <RequestProvider stateProvider?={optionalStateProvider} >
 *    <App />
 *  </RequestProvider
 * ```
 * @author Orar
 * @date   11/27/18, 2:04 PM
 */
class Provider extends PureComponent<Props> {
  props: Props;

  render() {
    const { children, stateProvider } = this.props;
    const props = { value: stateProvider };
    return React.createElement(RequestProviderContext, props, children);
  }
}

Provider.propTypes = {
  stateProvider: PropTypes.shape({
    name: PropTypes.string.isRequired,
    getState: PropTypes.func.isRequired,
    updateRequest: PropTypes.func.isRequired,
    observe: PropTypes.func.isRequired,
  }),
  children: PropTypes.node.isRequired
};


export default Provider;
