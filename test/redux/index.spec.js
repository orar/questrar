import { createRequestState, createStateProvider, requestStateReducer } from 'src/redux';
import { REQUEST_ACTION_TYPE } from "../../src/redux/common";


describe('[Redux Exports]', () => {

  it('#createRequestState should be a function', () => {
    expect(createRequestState).to.be.a('function')
  });


  it('#createStateProvider should be a function', () => {
    expect(createStateProvider).to.be.a('function')
  });


  it('#requestStateReducer should be a function', () => {
    expect(requestStateReducer).to.be.an('object').that.has.all.keys(REQUEST_ACTION_TYPE)
  });



});