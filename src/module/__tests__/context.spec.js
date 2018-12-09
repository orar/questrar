import Context, { RequestConsumerContext, RequestProviderContext } from '../context'

describe('[Context]', () => {
  it('Should export Context as default`', () => {
    expects(Context).to.not.be.undefined();
  });

  it('Should export Context Consumer as `RequestConsumerContext`', () => {
    expects(RequestConsumerContext).to.not.be.undefined();
  });

  it('Should export Context Provider as `RequestProviderContext`', () => {
    expects(RequestProviderContext).to.not.be.undefined();
  });
});
