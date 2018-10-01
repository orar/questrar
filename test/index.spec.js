import { Request, RequestProvider, withRequest } from 'index';


describe('(Entry) index', () => {

  it('Should export Request as a component', () => {
    expect(Request).to.be.a('')
  });

  it('Should export RequestProvider as a Component', () => {
    expect(RequestProvider).to.be.a('')
  });

  it('Should export withRequest as a function', () => {
    expect(withRequest).to.be.a('function');
  });

});