import defaultExport, { createStateProvider, RequestSubscription } from '../';


describe('Store Exports', () => {
  it('Should export default `defaultRequestStateProvider`', () => {
    expects(defaultExport.name).to.be.equal('createDefaultRequestStateProvider')
  });

  it('Should export a named `createStateProvider`', () => {
    expects(createStateProvider.name).to.be.equal('createStateProvider')
  });

  it('Should export a named `RequestSubscription`', () => {
    expects(RequestSubscription.name).to.be.equal('RequestSubscription')
  });
});
