// @flow
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { requestStateReducer } from 'questrar/redux';


// Default identity redux reducer
const identityReducer = (state) => {
  if (state) {
    return Object.assign({}, state);
  }
  return {}; // return empty for dummy actions
};

const addTodoReducer = (state, action) => {
  let data;
  if (Array.isArray(action.payload)) {
    data = state.data.concat(action.payload);
  } else {
    data = state.concat([action.payload]);
  }
  return { data };
};

const updateTodoReducer = (state, action) => {
  const data = state.data.map(t => t.id === action.payload.id ? action.payload : t);
  return { data };
};

const removeTodoReducer = (state, action) => {
  const data = state.data.filter(t => t.id === action.payload);
  return { data };
};

const removeAllTodoReducer = () => ({ data: [] });

const todoReducer = handleActions({
  addTodo: addTodoReducer,
  updateTodo: updateTodoReducer,
  removeTodo: removeTodoReducer,
  removeAllTodo: removeAllTodoReducer,
}, { data: [] });


export default combineReducers({
  app: identityReducer,
  todo: todoReducer,
  ...requestStateReducer,
});
