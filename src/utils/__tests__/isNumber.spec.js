import isNumber from '../isNumber'

describe('[Function] isNumber', () => {
  it('Should verify if a provided argument is a number', () => {
    const func = () => {};
    const str = 'not a function';
    const num = 342;
    const num1 = 342.34;

    expects(isNumber(num)).to.be.true();
    expects(isNumber(num1)).to.be.true();
    expects(isNumber(func)).to.be.false();
    expects(isNumber(str)).to.be.false();
  });
});
