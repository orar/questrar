import React from 'react';
import overrideRequestProps from '../overrideRequestProps';

describe('[Function] createRequestProp', () => {
  let parentProps,
    childProps;

  beforeEach(() => {
    parentProps = {
      onFailure: () => 'hasFailed',
      onSuccess: <div>Successful</div>,
      onPending: 'loading',
      pendOnMount: false,
      inject: true,
    };
    childProps = {
      onFailure: <div>failed</div>,
      onSuccess: () => <div>Successful</div>,
      onPending: '',
      pendOnMount: false,
      inject: false,
    }
  });

  it('Should override parent props for all matching pairs', () => {
    expects(overrideRequestProps(parentProps, childProps)).to.be.eql(childProps);
  })

});
