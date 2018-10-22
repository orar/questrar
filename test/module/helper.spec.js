
import { randomId, arrayValuesOfKeys, resetRequestFlags, isFunc, isNumber, isObj, nonEmpty } from "../../src/module/helper";
import { initialRequest } from "../../src/module/common";

describe('[helper]', () => {

  it('(randomId) Should always return a unique string', () => {
    const id = randomId();
    expect(typeof id === "string");
  });


  it('(arrayValuesOfKeys) Should extract array values of keys subset of an object', () => {
    const mockObj = { a: 'exA', b: 'ExB', c:234, d: { e: 'subset1', f: true }};
    const keys = ['a', 'd'];
    const result = arrayValuesOfKeys(mockObj, keys );

    expect(result.length).to.be.equal(keys.length);
    expect(result).to.include(mockObj.a);
    expect(result).to.include(mockObj.d)
  });


  it('(resetRequestFlags) Should reset all flags of a request state', () => {
    const req = initialRequest;
    req.success = true;
    req.failed = false;
    req.message = 'Reset this message property';
    const reset = resetRequestFlags(req);

    expect(reset.pending).to.be.false;
    expect(reset.failed).to.be.false;
    expect(reset.success).to.be.false;
    expect(reset.message).to.be.undefined
  });

  it('(isNumber) should verify if an argument is a number', () => {
    const func = () => {};
    let str = 'not a function';
    const num = 342;

    expect(isNumber(num)).to.be.true;
    expect(isNumber(func)).to.be.false;
    expect(isNumber(str)).to.be.false;
  });

  it('(isFunc) should verify if an argument is a function', () => {
    const func = () => {};
    function f() {}
    let notFunc = 'not a function';

    expect(isFunc(f)).to.be.true;
    expect(isFunc(func)).to.be.true;
    expect(isFunc(notFunc)).to.be.false;
  });

  it('(isObj) should verify if an argument is an object', () => {
    const func = () => {};
    let str = 'not a function';
    const obj = {};
    let obj1 = { a: 3 };

    expect(isObj(func)).to.be.false;
    expect(isObj(str)).to.be.false;
    expect(isObj(obj)).to.be.true;
    expect(isObj(obj1)).to.be.true;
  });

  it('(nonEmpty) should verify an argument is not empty', () => {
    const all = ['', {}, [], "", 2];
    all.forEach(a => expect(nonEmpty(a)).to.be.true);
  });
});
