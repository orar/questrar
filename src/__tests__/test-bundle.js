import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import dirtyChai from 'dirty-chai';
import shallowDeepEqual from 'chai-shallow-deep-equal';
import chai from 'chai';
//  import sinon from 'sinon';
//  import sinonChai from 'sinon-chai';

configure({ adapter: new Adapter() });

chai.use(dirtyChai);
chai.use(chaiEnzyme);
chai.use(shallowDeepEqual);

global.chai = chai;
global.expects = chai.expect;
