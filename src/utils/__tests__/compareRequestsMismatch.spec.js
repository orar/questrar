import { compareMultiRequestMismatch, compareRequestsMismatch, sortKeys } from '../compareRequestsMismatch';
import { makeRandomIds, mockProviderRequestState } from '../../__tests__/RequestMock';
import randomId from '../randomId';
import { initialRequest } from '../common';

describe('[File] compareRequestMismatch', () => {
  describe('[Function] compareRequestMismatch', () => {
    let id;
    let request1;
    let request2;

    beforeEach(function () {
      id = randomId();
      request1 = { ...initialRequest, id };
      request2 = { ...initialRequest, id }
    });

    it('Should return false if two request are same by $id and id properties', () => {
      expects(compareRequestsMismatch(request1, request2)).to.be.false();
    });

    it('Should return true if two request mismatch by id property', () => {
      request2.id = randomId();
      expects(compareRequestsMismatch(request1, request2)).to.be.true()
    });

    it('Should return true if two request mismatch by $id property', () => {
      request2.$id = Symbol(id);
      expects(compareRequestsMismatch(request1, request2)).to.be.true()
    });
  });


  describe('[Function] sortKeys', () => {
    let first;
    let second;

    beforeEach(() => {
      first = '1_abcd';
      second = '1_afsg';
    });

    it('Should return 1 if first is index lower than second in ascending order', () => {
      expects(sortKeys(first, second)).to.be.equal(-1)
    });

    it('Should return -1 if first is index higher than second in ascending order', () => {
      first = '1_eb'
      expects(sortKeys(first, second)).to.be.equal(1)
    });

    it('Should return 0 if first is same as second in ascending order', () => {
      first = second

      expects(sortKeys(first, second)).to.be.equal(0)
    });
  });

  describe('[Function] compareMultiRequestMismatch', () => {
    let idList;
    let first;
    let second;

    beforeEach(() => {
      idList = makeRandomIds();
      first = mockProviderRequestState(idList);
      second = mockProviderRequestState(idList);

    });

    it('should return false if two request maps have same `id`s and `$id`s properties', function () {
      expects(compareMultiRequestMismatch(first, second)).to.be.false()
    });

    it('should quickly return true if request keys sizes are not same ', () => {
      idList.push(randomId());
      second = mockProviderRequestState(idList);

      expects(compareMultiRequestMismatch(first, second)).to.be.true()
    });

    it('should return true if two request mismatch by a single id property', () => {
      idList[2] = randomId();
      second = mockProviderRequestState(idList);

      expects(compareMultiRequestMismatch(first, second)).to.be.true()
    });

    it('should return true if two request mismatch by $id property', () => {
      second[idList[2]].$id = Symbol(idList[2]);

      expects(compareMultiRequestMismatch(first, second)).to.be.true()
    });
  });
});
