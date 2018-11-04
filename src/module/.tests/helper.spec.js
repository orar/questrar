
import { randomId, arrayValuesOfKeys, resetRequestFlags, isFunc, isNumber, isObj, nonEmpty, isEmptyObj } from '../helper';
import { initialRequest } from '../common';

describe('[helper]', () => {
  it('(randomId) Should always return a unique string', () => {
    expects(randomId()).to.be.a('string');
  });

  describe('[Function] arrayValuesOfKeys', () => {
    it('Should extract an array of values of keys subset of an object', () => {
      const mockObj = { a: 'exA', b: 'ExB', c: 234, d: { e: 'subset1', f: true } };
      const keys = ['a', 'd'];
      const result = arrayValuesOfKeys(mockObj, keys);

      expects(result.length).to.be.equal(keys.length);
      expects(result).to.be.eql([mockObj.a, mockObj.d]);
    });

    it('Should extract array of values from an object' +
      ' based on a `getValue` function', () => {
      const mockObj = { a: 'exA', b: 'ExB', c: 234, d: { e: 'subset1', f: true } };
      const keys = ['a', 'b', 'd'];
      /* eslint-disable no-confusing-arrow */
      const getValue = (k, obj) => typeof obj[k] === 'string' ? obj[k].length : 2;
      const result = arrayValuesOfKeys(mockObj, keys, getValue);

      expects(result.length).to.be.equal(3);
      expects(result).to.eql([mockObj.a.length, mockObj.b.length, 2]);
    });

    it('Should extract array of values from an object' +
      ' based on a `getValue` function', () => {
      const mockObj = { a: 'exA', b: 'ExB', c: 234, d: { e: 'subset1', f: true } };
      const keys = ['a', 'b', 'd'];
      /* eslint-disable no-confusing-arrow */
      const getValue = (k, obj) => typeof obj[k] === 'string' ? obj[k].length : 2;
      const result = arrayValuesOfKeys(mockObj, keys, getValue);

      expects(result.length).to.be.equal(3);
      expects(result).to.eql([mockObj.a.length, mockObj.b.length, 2]);
    });

    it('Should return an empty list on no key found', () => {
      const mockObj = { a: 'exA', b: 'ExB', c: 234, d: { e: 'subset1', f: true } };
      const keys = 'y';
      const result = arrayValuesOfKeys(mockObj, keys);

      expects(result.length).to.be.equal(0);
      expects(result).to.be.empty()
    });

    it('Should extract array of values from an object given a single key with `getValue`', () => {
      const mockObj = { a: 'exA', b: 'ExB', c: 234, d: { e: 'subset1', f: true } };
      const keys = 'a';
      const getValue = (k, o) => o[k].length;
      const result = arrayValuesOfKeys(mockObj, keys, getValue);

      expects(result.length).to.be.equal(1);
      expects(result).to.be.eql([mockObj.a.length]);
    });

    it('Should extract array of values from an object given a single key', () => {
      const mockObj = { a: 'exA', b: 'ExB', c: 234, d: { e: 'subset1', f: true } };
      const keys = 'a';
      const result = arrayValuesOfKeys(mockObj, keys);

      expects(result.length).to.be.equal(1);
      expects(result).to.be.eql([mockObj.a]);
    });
  });

  it('[Function](resetRequestFlags) Should reset all flags of a request state', () => {
    const req = initialRequest;
    req.success = true;
    req.failed = false;
    req.message = 'Reset this message property';
    const reset = resetRequestFlags(req);

    expects(reset.pending).to.be.false();
    expects(reset.failed).to.be.false();
    expects(reset.success).to.be.false();
    expects(reset.message).to.be.undefined()
  });

  it('[Function](isNumber) should verify if a provided argument is a number', () => {
    const func = () => {};
    const str = 'not a function';
    const num = 342;
    const num1 = 342.34;

    expects(isNumber(num)).to.be.true();
    expects(isNumber(num1)).to.be.true();
    expects(isNumber(func)).to.be.false();
    expects(isNumber(str)).to.be.false();
  });

  it('[Function](isFunc) should verify if a provided argument is a function', () => {
    const func = () => {};
    function f() {}
    const notFunc = 'not a function';

    expects(isFunc(f)).to.be.true();
    expects(isFunc(func)).to.be.true();
    expects(isFunc(notFunc)).to.be.false();
  });

  it('[Function](isObj) should verify if a provided argument is an object', () => {
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

  it('[Function](nonEmpty) should verify if a provided argument is not empty', () => {
    const all = ['', {}, [], '', 2];
    all.forEach(a => expects(nonEmpty(a)).to.be.true);
  });

  it('[Function](isEmptyObj) should verify not non-empty object has own props', () => {
    const obj1 = {};
    const obj2 = Object.create({ x: 1 });
    const obj3 = { r: 4 };

    expects(isEmptyObj(obj1)).to.be.true();
    expects(isEmptyObj(obj2)).to.be.true();
    expects(isEmptyObj(obj3)).to.be.false();
  })
});
