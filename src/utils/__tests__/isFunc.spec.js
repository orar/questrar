import isFunc from '../isFunc'

describe('[Function] isFunc', () => {
  it('Should verify if a provided argument is a function', () => {
    const func = () => {};
    function f() {}
    const notFunc = 'not a function';

    expects(isFunc(f)).to.be.true();
    expects(isFunc(func)).to.be.true();
    expects(isFunc(notFunc)).to.be.false();
  });
});
