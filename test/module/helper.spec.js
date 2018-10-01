
import { randomId, arrayValuesOfKeys, resetRequestFlags } from "../../src/module/helper";
import { initialRequest } from "../../src/module/common";

describe('[helper]', () => {

  it('(Function) Should return a unique string of size 10', () => {
    const id = randomId(10);
    expect(typeof id === "string");
    expect(id.length === 10);
  });

  it('(Function) Should return a unique with all chars between a and h', () => {
    const aCode = 'a'.charCodeAt(0);
    const hCode = 'h'.charCodeAt(0);
    const id = randomId(10).split('');
    id.map(i => {
      expect(aCode <= i.charCodeAt(0) && i.charCodeAt(0) <= hCode).to.be.true
    });
  });


  it('(Function) Should extract array values of keys subset of an object', () => {
    const mockObj = { a: 'exA', b: 'ExB', c:234, d: { e: 'subset1', f: true }};
    const keys = ['a', 'b', 'c', 'd'];
    const result = arrayValuesOfKeys(mockObj, keys );
    expect(result.length).to.be.equal(keys.length);
  });


  it('(Function) Should reset all flags of a request state', () => {
    const req = initialRequest;
    req.success = true;
    req.failed = false;
    const reset = resetRequestFlags(req);

    expect(reset.isPending).to.be.false;
    expect(reset.success).to.be.false;
    expect(reset.failed).to.be.false;
  });

});