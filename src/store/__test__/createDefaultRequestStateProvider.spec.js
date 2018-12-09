import createDefaultRequestStateProvider from '../createDefaultRequestStateProvider';

describe('[Function] createDefaultRequestStateProvider', () => {
  it('Should be a function', () => {
    expects(createDefaultRequestStateProvider).to.be.a('function');
  });

  it('Should return a state provider', () => {
    const provider = createDefaultRequestStateProvider();
    expects(provider).to.have.all.keys(['name', 'getState', 'observe', 'updateRequest']);
  });
});
