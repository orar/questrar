// @flow
import { combineReducers } from 'redux';
import { handleActions, createAction } from 'redux-actions';
import { requestStateReducer } from 'questrar/redux';

// ======================================================
// Actions
// ======================================================

export const fetchTodo = createAction('FETCH_TODO');
export const addTodo = createAction('ADD_TODO');

export const saveTodo = createAction('SAVE_TODO');
export const updateTodo = createAction('UPDATE_TODO');
export const removeTodo = createAction('REMOVE_TODO');

// ======================================================
// Reducers
// ======================================================


// Default identity redux reducer
const identityReducer = (state) => {
  if (state) {
    return state;
  }
  return {};
};

const saveTodoReducer = (state, action) => {
  let data;
  if (Array.isArray(action.payload)) {
    data = state.data.concat(action.payload);
  } else {
    data = state.data.concat([action.payload]);
  }
  return { data };
};

const updateTodoReducer = (state, action) => {
  const data = state.data.map(todo => (todo.id === action.payload.id ? action.payload : todo));
  return { data };
};

const removeTodoReducer = (state, action) => {
  const data = state.data.filter(t => t.id !== action.payload);
  return { data };
};


const todoReducer = handleActions({
  [saveTodo]: saveTodoReducer,
  [updateTodo]: updateTodoReducer,
  [removeTodo]: removeTodoReducer,
}, { data: [] });


export default combineReducers({
  app: identityReducer,
  todo: todoReducer,

  ...requestStateReducer,
});
