
import randomId from '../randomId'

describe('[Function] randomId', () => {
  it('Should always return a unique string', () => {
    expects(randomId()).to.be.a('string');
  });
});
