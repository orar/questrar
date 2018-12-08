// @flow
import invariant from 'invariant';
import isFunc from './isFunc';
import getComponentName from './getComponentName';

/**
 * Validates or throws if a argument is not a React component
 * @param Component
 */
export default (Component: Object) => {
  if (process.env.NODE_ENV !== 'production') {
    invariant(
      isFunc(Component) && (
        Component.prototype.isReactComponent
        || /react.*.createElement\(/.test(String(Component))
      ),
      `Expected ${String(Component)} to be a React Component instead. `
     + 'Please provide a React Component'
    );
  }
};
