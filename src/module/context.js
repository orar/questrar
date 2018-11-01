// @flow
import React from 'react';
import type { RequestContext } from '../index';


export const initialRequestContextState: RequestContext = {
  data: {},
  actions: {}
};

//  React Context api
const {
  Provider: RequestProviderContext,
  Consumer: RequestConsumerContext,
} = React.createContext(initialRequestContextState);

export { RequestProviderContext, RequestConsumerContext };
