import isEmptyObj from '../isEmptyObj'


describe('[Function] isEmptyObj', () => {

  it('Should verify not non-empty object has own props', () => {
    const obj1 = {};
    const obj2 = Object.create({ x: 1 });
    const obj3 = { r: 4 };

    expects(isEmptyObj(obj1)).to.be.true();
    expects(isEmptyObj(obj2)).to.be.true();
    expects(isEmptyObj(obj3)).to.be.false();
  })
});
