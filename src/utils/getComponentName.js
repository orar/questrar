// @flow

/**
 * Gets the name of a React component
 * @param Component
 * @returns {*|string}
 */
export default function getComponentName (Component: Object): string {
  return Component.displayName || Component.name || Component.type.toString()
}
