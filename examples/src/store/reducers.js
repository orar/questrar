// @flow
import { combineReducers } from 'redux';
import { requestStateReducer } from 'questrar/redux'


//Default identity redux reducer
const identityReducer = (state) => {
  if (state) {
    return Object.assign({}, state);
  }
  return {}; //return empty for dummy actions
};



export default combineReducers({
  '_APP_': identityReducer,
  ...requestStateReducer
});