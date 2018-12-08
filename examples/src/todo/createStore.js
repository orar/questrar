// @flow
import { createStore, compose, applyMiddleware } from 'redux';
import todoSaga, { sagaMiddleware } from './sagas';
import { isFunc } from '../helper';
import reducers from './reducers';


/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */

export default () => {
  let composer = compose;

  // Let see what our redux store would contain in browser in dev mode
  const devToolExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  if (isFunc(devToolExtension)) {
    composer = devToolExtension;
  }

  const initialState = {};

  const store = createStore(
    reducers,
    initialState,
    composer(
      applyMiddleware(sagaMiddleware),
    ),
  );

  sagaMiddleware.run(todoSaga);

  return store;
};
