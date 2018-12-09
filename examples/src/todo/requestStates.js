import { createRequestState } from 'questrar/redux';


// ======================================================
// Questrar request states
// ======================================================

export const fetchTodoState = createRequestState('FETCH_TODO_REQUEST');
export const addTodoState = createRequestState('ADD_TODO_REQUEST');
