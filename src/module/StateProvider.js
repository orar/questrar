// @flow


/**
 * State provider interface
 */
export default class StateProvider {

  /**
   * Initialize state
   * @returns {null}
   */
  initializeState = () => {
    return null;
  };

  /**
   * Get the request state
   * @returns {{}}
   */
  getState = () => {
    return {};
  };


  /**
   * Put request state
   * @param state
   * @returns {null}
   */
  putState = (state: Object) => {
    return null
  };

}