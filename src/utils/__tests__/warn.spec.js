import warn from '../warn';

describe('[Function] warn', () => {
  let error;
  let message;

  beforeEach(() => {
    message = 'boring error message';
    error = jest.spyOn(console, 'error');
  });

  afterEach(() => {
    error.mockRestore();
  });

  it('Should be a function', () => {
    expects(warn).to.be.a('function');
  });

  it('Should log to console if there is', () => {
    warn(message);
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('Should log to console only not in production', () => {
    warn(message);
    expect(error).toHaveBeenCalledTimes(1);
    process.env.NODE_ENV = 'production';
    warn(message);
    expect(error).toHaveBeenCalledTimes(1);
    process.env.NODE_ENV = 'development';
  });

  it('Should prefix log', () => {
    const prefix = 'strangeLog';
    warn(message, prefix);
    expect(error).toHaveBeenNthCalledWith(1, prefix, message)
  });
});
