import { initialRequest } from '../../utils/common';
import randomId from '../../utils/randomId';

export const makeRandomIds = (size = 10) => Array(size).fill(1).map(randomId);

export const mockProviderRequestState = (idList) => {
  return idList.reduce((acc, id) => {
    const req = Object.assign({ id }, initialRequest);
    return Object.assign({}, acc, { [id]: req });
  }, {});
};


export const mockStateProvider = (providerState = {}, stateId = Symbol('testStateId')) => {
  return {
    name: 'Test.State.Provider',
    getState: jest.fn(() => ({ id: stateId, data: providerState })),
    updateRequest: jest.fn(),
    observe: jest.fn(() => jest.fn()),
  }
};
