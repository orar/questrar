import { randomId } from "../../src/module/helper";
import createStateProvider from 'src/redux/createStateProvider';



describe('[createStateProvider]', () => {
  let id;

  before(() => {
    id = randomId();
  });



  it('should be a function', () => {
    expect(createStateProvider).to.be.a('function');
  });




});