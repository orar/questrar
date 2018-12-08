import { Request, Requests, Provider, withRequest } from '../index';

describe('[Entry] index', () => {
  //
  it('Should export Request as a stateless component', () => {
    expects(Request).to.be.a('function')
  });

  it('Should export Requests as a stateless component', () => {
    expects(Requests).to.be.a('function')
  });

  it('Should export RequestProvider as a Component', () => {
    expect(Provider).toBeDefined();
    expect(Provider).not.toBeNull();
  });

  it('Should export withRequest HOC as a function', () => {
    expects(withRequest).to.be.a('function');
  });
});
