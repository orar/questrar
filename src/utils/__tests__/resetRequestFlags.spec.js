import resetRequestFlags from '../resetRequestFlags'
import { initialRequest } from '../common';

describe('[Function] resetRequestFlags', () => {

  it('Should reset all flags of a request state', () => {
    const req = initialRequest;
    req.success = true;
    req.failed = false;
    req.message = 'Reset this message property';
    const reset = resetRequestFlags(req);

    expects(reset.pending).to.be.false();
    expects(reset.failed).to.be.false();
    expects(reset.success).to.be.false();
    expects(reset.message).to.be.undefined()
  });

});
