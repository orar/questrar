import compareRequestsMismatch from '../compareRequestsMismatch';
import randomId from '../randomId';
import { initialRequest } from '../common';

describe('[Function] compareRequestMismatch', () => {
  let request1;
  let request2;

  beforeEach(function () {
    const id = randomId();
    request1 = { ...initialRequest, id };
    request2 = { ...initialRequest, id }
  });

  it('Should return true if two request mismatch', () => {
    expects(compareRequestsMismatch(request1, request2)).to.be.true();
  });

  it('Should return false if two request are same, no mismatch ', () => {
    request2 = request1
    expects(compareRequestsMismatch(request1, request2)).to.be.false()
  });
});
