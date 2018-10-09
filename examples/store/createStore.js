// @flow
import { createStore, compose, applyMiddleware } from 'redux';
import { createRequestState } from '../../providers/redux'
import { sagaMiddleware, profileSaga } from './sagas';
import {isFunc} from "../../src/module/helper";
import reducers from './reducers';



//Create a free request state action creator for profile fetch with an id: PROFILE_FETCH_REQUEST_STATE
export const fetchProfileState = createRequestState('PROFILE_FETCH_REQUEST_STATE');



export default () => {

  let composer = compose;

  //Let see what our redux store would contain in browser in dev mode
  const devToolExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  if(isFunc(devToolExtension)){
    composer = devToolExtension;
  }

  const initialState = {};

  const store = createStore(
    reducers,
    initialState,
    composer(
      applyMiddleware(sagaMiddleware),
    )
  );

  sagaMiddleware.run(profileSaga);

  return store;
};