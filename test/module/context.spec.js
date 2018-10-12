import { RequestConsumerContext, RequestProviderContext} from "../../src/module/context";
import React from 'react';

describe('[Context]', () => {
  let context = null;

  before(() => {
    context = React.createContext()
  });

  it('Should export Context Consumer as `RequestConsumerContext`', () => {
    expect(RequestConsumerContext).to.not.be.undefined;
  });

  it('Should export Context Provider as `RequestProviderContext`', () => {
    expect(RequestProviderContext).to.not.be.undefined;
  });

});