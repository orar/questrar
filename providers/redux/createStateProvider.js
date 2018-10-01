// @flow
import type {Store} from 'redux';
import StateProvider from "../../src/module/StateProvider";
import { injectReducers } from "./RequestReducer";
import requestReducer from './RequestReducer';
import { REQUEST_ACTION_TYPE } from "../../src/module/common";
import type {ProviderRequestState} from "../../src/QuestrarTypes";
import { REPLACE } from "../../src/module/common";


/**
 * Create a redux to questrar mapper
 * It uses replace state to sync from provider to redux and back
 * @param store
 * @returns {{getState: getState, putState: putState}}
 */
export default function createStateProvider (store: Store) {

  /**
   * Inject reducers as part of store
   */
  injectReducers(store, { key: REQUEST_ACTION_TYPE, reducer: requestReducer });

  const s = store;

  /**
   * Gets the redux request state current
   * @returns {*}
   */
  function getState(){
    const state = s.getState();
    console.log(state);
    if(Object.hasOwnProperty.call(state, REQUEST_ACTION_TYPE)){
      return state[REQUEST_ACTION_TYPE];
    }
    return {};
  }

  /**
   * Puts the entire request state into redux
   * @param state
   */
  function putState(state: ProviderRequestState){
    s.dispatch({ type: REPLACE, payload: state });
  }

  /**
   * Watches the request state and forces update of RequestProvider if there's been a change.
   *
   * CAVEAT: Updates on any store state change if requestState is not empty
   * TODO: Implement a requestState change tracker
   *
   * @param update
   */
  function observe(update: (shouldUpdate: boolean) => any){
    return store.subscribe(() => {
      const _s = getState();
      if(_s){
        return update(true)
      }
      update(false);
    });
  }


  return {
    getState, putState, observe
  }

}

