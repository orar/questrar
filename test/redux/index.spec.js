import { createRequestState, createStateProvider, requestStateReducer } from '../../src/redux';
import { REQUEST_ACTION_TYPE } from '../../src/redux/common';


describe('[Redux Exports]', () => {
  describe('[createRequestState]', () => {
    it('#createRequestState should be exported as a function', () => {
      expects(createRequestState).to.be.a('function')
    });
  });

  describe('[createStateProvider]', () => {
    it('Should be exported as a function', () => {
      expects(createStateProvider).to.be.a('function')
    });
  });

  describe('[requestStateReducer]', () => {
    it('Should be exported as a redux reducer map', () => {
      expects(requestStateReducer).to.be.an('object').that.has.all.keys(REQUEST_ACTION_TYPE)
    });
  });
});
