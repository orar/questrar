import arrayValuesOfKeys from '../arrayValuesOfKeys'


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
