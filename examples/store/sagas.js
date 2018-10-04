// @flow
import 'regenerator-runtime/runtime';
import createSagaMiddleware from 'redux-saga';
import { take, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { fetchProfileState } from "./createStore";



export const sagaMiddleware = createSagaMiddleware();


const profile = {
  name: 'Sag Amid Leware',
  age: 25,
  university: 'Solar',
  homePlanet: 'Mars',
  address: 'Oxide 34 street, Meltpoint, Nalpole Crater, Mars',
  interLanguage: 'klingon'
};


//Saga worker function
export function* profileSaga(): Generator<*, *, *> {
  while(true){
    const _ = yield take('FETCH_PROFILE_INFO');
    yield put(fetchProfileState.pending('Loading...'));
    const badResponse = yield delay(3000, 'Profile not available. Retrying...');
    yield put(fetchProfileState.failed(badResponse));
    const response = yield delay(3000, profile);
    yield put(fetchProfileState.success(response));
  }
}
