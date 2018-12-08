import isObj from '../isObj'

describe('[Function] isObj', () => {
  it('Should verify if a provided argument is an object', () => {
    const func = () => {};
    const str = 'not a function';
    const obj = {};
    const obj1 = { a: 3 };
    const nul = null;

    expects(isObj(func)).to.be.false();
    expects(isObj(nul)).to.be.false();
    expects(isObj(str)).to.be.false();
    expects(isObj(obj)).to.be.true();
    expects(isObj(obj1)).to.be.true();
  });
});
