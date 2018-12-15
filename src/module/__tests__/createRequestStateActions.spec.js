import createRequestStateActions, {
  success,
  failed,
  pending,
  clean,
  dirty,
  remove
} from '../createRequestStateActions';
import randomId from '../../utils/randomId';
import { CLEAN, DIRTY, FAILED, PENDING, REMOVE, SUCCESS } from '../../utils/common';
import { mockStateProvider } from '../../__tests__/RequestMock';

describe('createRequestStateActions', () => {
  let provider;
  let action;
  let id;
  let message;

  beforeEach(() => {
    id = randomId();
    message = 'creating a request action';
    action = { id };
    provider = mockStateProvider();
  });


  it('[Function](success) should update a request state to success', () => {
    action.status = SUCCESS;
    action.message = message;
    success(provider)(id, message);
    createRequestStateActions(provider).success(id, message)
    expect(provider.updateRequest).toHaveBeenNthCalledWith(2, action)
  });

  it('[Function](failed) should update a request state to failed', () => {
    action.status = FAILED;
    action.message = message;
    failed(provider)(id, message);
    createRequestStateActions(provider).failed(id, message)
    expect(provider.updateRequest).toHaveBeenNthCalledWith(2, action)
  });

  it('[Function](pending) should update a request state to pending', () => {
    action.status = PENDING;
    action.message = message;
    pending(provider)(id, message);
    createRequestStateActions(provider).pending(id, message)

    expect(provider.updateRequest).toHaveBeenNthCalledWith(2, action)
  });

  it('[Function](remove) should remove a request state', () => {
    action.status = REMOVE;
    remove(provider)(id);
    createRequestStateActions(provider).remove(id)
    expect(provider.updateRequest).toHaveBeenNthCalledWith(2, action)
  });

  it('[Function](clean) should update a request state to clean', () => {
    action.status = CLEAN;
    clean(provider)(id);
    createRequestStateActions(provider).clean(id)
    expect(provider.updateRequest).toHaveBeenNthCalledWith(1, action)
  });

  it('[Function](dirty) should update a request state to dirty', () => {
    action.status = DIRTY;
    dirty(provider)(id);
    createRequestStateActions(provider).failed(id);
    expect(provider.updateRequest).toHaveBeenNthCalledWith(1, action)
  });

  describe('[Function] createRequestStateActions', function () {
    it('Should be a function', () => {
      expects(createRequestStateActions).to.be.a('function');
    });

    it('Should return a function', () => {
      expects(createRequestStateActions(provider)).to.be.a('function');
    });

    it('Should return provider name', () => {
      expects(createRequestStateActions(provider)()).to.be.a('string').that.is.equal(provider.name);
    });

    it('Should have all request action functions', () => {
      const action = createRequestStateActions(provider);
      expects(action.failed).to.be.a('function');
      expects(action.success).to.be.a('function');
      expects(action.pending).to.be.a('function');
      expects(action.dirty).to.be.a('function');
      expects(action.clean).to.be.a('function');
      expects(action.remove).to.be.a('function');
    })
  });
});
