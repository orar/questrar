import React from 'react';
import createCache from '../RequestsSubTreesCache';
import randomId from '../../utils/randomId';
import { initialRequest } from '../../utils/common';
import { makeRandomIds, mockProviderRequestState } from '../../__tests__/RequestMock';

describe('[Function] createCache', () => {
  let cache;

  beforeEach(() => {
    cache = createCache();
  });

  it('Should return a cache object', () => {
    expects(cache).to.be.an('object')
      .that.has.all.keys(['requests', 'set', 'has', 'getTree', 'cleanSelf']);
  });

  it('Should be an optimised Map ', () => {
    expects(cache.requests instanceof Map).to.be.true()
  });

  it('Should set a request tree by its id and $id', () => {
    const id = randomId();
    const request = { ...initialRequest, id };
    const tree = <div>test tree</div>;
    cache.set(request, tree);
    expects(cache.requests.get(id)).to.eql({ $id: request.$id, tree })
  });


  it('Should be able to check if an existing tree is not expired by its $id', () => {
    const id = randomId();
    const request = { ...initialRequest, id };
    const tree = <div>test tree</div>;
    cache.set(request, tree);
    expects(cache.has(request)).to.be.true();
    request.$id = Symbol(id);
    expects(cache.has(request)).to.be.false();
  });

  it('Should remove an existing tree entry from cache upon has-check', () => {
    const id = randomId();
    const request = { ...initialRequest, id };
    const tree = <div>test tree</div>;
    cache.set(request, tree);
    expects(cache.has(request)).to.be.true();
    request.$id = Symbol(id);
    expects(cache.has(request)).to.be.false();
    expects(cache.requests.get(id)).to.be.undefined()
  });

  it('#getTree should return only corresponding tree from cache', () => {
    const id = randomId();
    const request = { ...initialRequest, id };
    const tree = <div>test tree</div>;
    cache.set(request, tree);

    expects(cache.getTree(request)).to.be.eql(tree);
  });

  it('#getTree should return null instead of undefined if key is not found', () => {
    const id = randomId();
    const request = { ...initialRequest, id };
    expects(cache.getTree(request)).to.be.equal(null);
  });

  it('Should remove all leftover keys from cache by their `id`s', () => {
    const idList = makeRandomIds();
    const providerState = mockProviderRequestState(idList);
    const tree = <div>test tree</div>;
    Object.keys(providerState).map(key => cache.set(providerState[key], tree));
    expects(cache.requests.size).to.be.equal(idList.length);
    const sliced = idList.slice(2, 6)
    const newProviderState = mockProviderRequestState(sliced);
    cache.cleanSelf(newProviderState);
    expects(cache.requests.size).to.be.equal(sliced.length);
  });
});
