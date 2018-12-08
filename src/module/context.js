// @flow
import React from 'react';

const RequestContext = React.createContext();

//  React Context provider and consumer
const {
  Provider: RequestProviderContext,
  Consumer: RequestConsumerContext,
} = RequestContext;

export { RequestProviderContext, RequestConsumerContext };

export default RequestContext;
