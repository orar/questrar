import RequestError from '../../src/components/RequestError/index';
import RequestSuccess from '../../src/components/RequestSuccess/index';
import RequestPending from '../../src/components/RequestPending/index';

describe('Exports', () => {
  /* eslint-disable no-unused-expressions */
  it('<RequestSuccess /> should be default exported from its directory', () => {
    expects(RequestError).to.be.defined;
  });

  it('<RequestSuccess /> should be default exported from its directory', () => {
    expects(RequestSuccess).to.be.defined;
  })

  it('<RequestPending /> should be default exported from its directory', () => {
    expects(RequestPending).to.be.defined;
  })
});
