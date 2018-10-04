// @flow


/**
 * State provider interface
 */
export default class StateProvider {


  /**
   * Gets all of the request states in store
   * @returns {{}}
   */
  getState = () => {
    return {};
  };


  /**
   * Puts request state
   * Updates all of request states in store
   *
   * @param state
   * @returns {null}
   */
  putState = (state: Object) => {
    return null
  };

  /**
   * Updates a specific requestState in store
   * @param requestStatus
   * @returns {null}
   */
  updateRequest = (requestStatus: Object) => {
    return null;
  };

  /**
   * Observe changes to the request state and re-renders the RequestProvider tree subsequently
   */
  observe = (updater: (shouldUpdate: boolean) => any) => {
    return updater(false);
  };


}