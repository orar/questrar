import createRequestBookkeeper from '../createRequestBookkeeper';
import randomId from '../../utils/randomId';
import { makeRandomIds, mockProviderRequestState, mockStateProvider } from './mock';

describe('[Function] createRequestBookkeeper', () => {
  let stateId;
  let idList;
  let firstId;
  let selectedIds;
  let providerState;

  let provider;
  let bookkeeper;

  let requestSelector = (id, state) => state.data[id];
  let mismatchComparator = (request1, request2) => request1 !== request2;


  const mockProviderState = () => {
    providerState = mockProviderRequestState(idList)
  };

  const createBookkeeper = () => {
    bookkeeper = createRequestBookkeeper(provider, requestSelector, mismatchComparator);
  };

  beforeEach(() => {
    stateId = Symbol(randomId());
    idList = makeRandomIds();
    firstId = idList[1];
    selectedIds = idList.slice(2, 5);
    mockProviderState();

    provider = mockStateProvider(providerState, stateId);

    createBookkeeper();
  });

  it('Should return an object with props', () => {
    expects(bookkeeper)
      .to.be.an('object')
      .that.has.keys(['request', 'checkForUpdate', 'clearSelf']);
  });

  it('Should decide an update as true for a new bookkeeper', () => {
    bookkeeper.checkForUpdate(firstId);
    expects(bookkeeper.shouldUpdate).to.be.true();
    expects(bookkeeper.request).to.include({ id: firstId });
  });

  it('Should cancel an update if there is no change in request state', () => {
    bookkeeper.checkForUpdate(firstId);
    expects(bookkeeper.shouldUpdate).to.be.true();
    bookkeeper.checkForUpdate(firstId);
    expects(bookkeeper.shouldUpdate).to.be.false();
    bookkeeper.checkForUpdate(firstId);
    expects(bookkeeper.shouldUpdate).to.be.false();
    expect(provider.getState).toHaveBeenCalledTimes(3)
  });

  it('Should reset its self on call `clearSelf`', () => {
    bookkeeper.checkForUpdate(firstId);
    expects(bookkeeper.shouldUpdate).to.be.true();
    bookkeeper.clearSelf();
    expects(bookkeeper.shouldUpdate).to.be.false();
    expects(bookkeeper.request).to.be.empty();
  });

});
