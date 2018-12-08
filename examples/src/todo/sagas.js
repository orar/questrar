// @flow
import 'regenerator-runtime/runtime';
import { call, put, take, spawn, all } from 'redux-saga/effects';
import createSagaMiddleware, { delay } from 'redux-saga';
import { fetchTodoState, addTodoState } from './requestStates';
import { fetchTodo, saveTodo, updateTodo, addTodo, removeAllTodo } from './reducers';
import todos from './TodoListSample';

export const sagaMiddleware = createSagaMiddleware();


const fetchTodoFromApi = (payload) => {
  if (payload) {
    return todos;
  }
  throw new Error("We couldn't fetch your todos at this time");
};

export function* fetchTodoSaga(): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(fetchTodo().type);
    yield put(fetchTodoState.pending());
    try {
      const response = yield delay(3000, yield call(fetchTodoFromApi, payload));
      yield put(saveTodo(response));
      yield put(fetchTodoState.success());
    } catch (e) {
      yield put(fetchTodoState.failed(e.message));
    }
  }
}

export function* addTodoSaga(): Generator<*, *, *> {
  while (true) {
    const { payload } = yield take(addTodo().type);
    yield put(addTodoState.pending());
    try {
      const response = yield delay(3000, payload);
      yield put(saveTodo(response));
      yield put(addTodoState.success());
    } catch (e) {
      yield put(addTodoState.failed(e.message));
    }
  }
}


function* todoSaga(): Generator<*, *, *> {
  yield all([
    spawn(fetchTodoSaga),
    spawn(addTodoSaga),
  ]);
}

export default todoSaga;
