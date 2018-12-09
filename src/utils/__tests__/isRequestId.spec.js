import isRequestId from '../isRequestId';

describe('[Function] isRequestId', () => {

  it('Should pass a request id if it is a non-empty string, number or symbol', () => {
    const ids = ['erewe', 3435, Symbol('sym')];
    ids.forEach(id => expects(isRequestId(id)).to.be.true());
  });

  it('Should not pass a request id if it is not a non-empty string, number or symbol', () => {
    const ids = ['', {}, [], true, /er/];
    ids.forEach(id => expects(isRequestId(id)).to.be.false());
  });
});
