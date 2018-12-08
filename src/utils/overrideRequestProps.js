// @flow
import nonEmpty from './nonEmpty'

/**
 * Overrides Requests props with child props
 *
 * @param allProps
 * @param childProps
 * @returns {{pendOnMount, onFailure, onSuccess, onPending, inject}}
 */
export default (allProps: Object, childProps: Object = {}) => {
  const { pendOnMount, onFailure, onSuccess, onPending, inject } = childProps;

  const requestProps = allProps;
  if (nonEmpty(inject)) {
    requestProps.inject = inject
  }
  if (nonEmpty(pendOnMount)) {
    requestProps.pendOnMount = pendOnMount
  }
  if (nonEmpty(onFailure)) {
    requestProps.onFailure = onFailure
  }
  if (nonEmpty(onPending)) {
    requestProps.onPending = onPending
  }
  if (nonEmpty(onSuccess)) {
    requestProps.onSuccess = onSuccess
  }

  return requestProps;
};
