import { configure } from 'enzyme';
import shallowDeepEqual from 'chai-shallow-deep-equal';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import enzymeChai from  'chai-enzyme';
import sinon from 'sinon';
import dirtyChai from 'dirty-chai';

configure({ adapter: new Adapter() });

chai.use(sinonChai);
chai.use(enzymeChai);
chai.use(dirtyChai);
chai.use(shallowDeepEqual);


global.chai = chai;
global.expect = chai.expect;
global.should = chai.should();
global.sinon = sinon;



const testContext = require.context('./', true, /.*\.spec\.jsx?$/);
testContext.keys.forEach(testContext);