import { selectRequestStates, selectSingleRequestState } from '../selectRequestStates';
import { makeRandomIds, mockProviderRequestState } from '../../__tests__/RequestMock';

describe('Selectors', () => {
  describe('[Function] selectRequestStates', () => {
    let idList;
    let firstId;
    let selectedIds;
    let providerState;


    const mockProviderState = () => {
      providerState = mockProviderRequestState(idList)
    };

    beforeEach(() => {
      idList = makeRandomIds()
      firstId = idList[0];
      selectedIds = idList.slice(2, 5);

      mockProviderState();
    });

    it('Should return an empty object if id is not an array or array is empty', () => {
      const state = selectRequestStates(firstId, providerState);
      expects(state).to.be.empty();
      const state2 = selectRequestStates([], providerState);
      expects(state2).to.be.empty();
    });

    it('Should extract all request states matching given list of ids from non-empty provider state', () => {
      const states = selectRequestStates(selectedIds, providerState);

      expects(states).to.be.an('object').that.has.all.keys(selectedIds);
    });

    it('Should extract all request states matching given list of ids from an empty or no provider state', () => {
      const states = selectRequestStates(selectedIds);

      expects(states).to.be.an('object').that.has.all.keys(selectedIds);
    });
  });

  describe('[Function] selectSingleRequestState', () => {
    let firstId;
    let idList;
    let providerState;

    const mockProviderState = () => {
      providerState = mockProviderRequestState(idList)
    };

    beforeEach(() => {
      idList = makeRandomIds();
      firstId = idList[0];

      mockProviderState();
    });

    it('Should extract a request state given an id and non-empty provider state', () => {
      const state = selectSingleRequestState(firstId, providerState);

      expects(state).to.be.an('object')
        .that.includes({ id: idList[0] })
        .that.is.eql(providerState[firstId]);
    });

    it('Should extract a request state given an id and an empty or no provider state', () => {
      const state = selectSingleRequestState(firstId);

      expects(state).to.be.an('object').that.includes({ id: idList[0] });
    });

  });
});
