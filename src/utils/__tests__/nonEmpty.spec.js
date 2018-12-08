import nonEmpty from '../nonEmpty'

describe('[Function] nonEmpty', () => {
  it('Should verify if a provided argument is not empty', () => {
    const all = ['', {}, [], false, 2];
    all.forEach(a => expects(nonEmpty(a)).to.be.true);
  });
});
