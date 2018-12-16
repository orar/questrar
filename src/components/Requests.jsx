// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import type { Node } from 'react';
import withRequest from '../module/withRequest';
import renderRequestState from './RequestFactory';
import type { RequestProp, RequestMapProp } from '../index';
import extractRequestIds from '../utils/extractRequestIds';
import overrideRequestProps from '../utils/overrideRequestProps';
import isRequestId from '../utils/isRequestId';
import type { RequestsSubTreesCache } from './RequestsSubTreesCache';
import createCache from './RequestsSubTreesCache';
import isEmptyObj from '../utils/isEmptyObj';


type Props = {
  id?: (props: Object) => string|number,
  children?: Array<Node>,
  request: RequestMapProp,

  pendOnMount?: Node | (r: RequestProp, children?: Node) => Node | boolean,
  onFailure?: Node | (r: RequestProp, children?: Node) => Node,
  onSuccess?: Node | (r: RequestProp, children?: Node) => Node,
  inject?: boolean | (request: RequestProp) => Object,

  skipOldTrees?: boolean,
}

/**
 * Renders a large list of requestor components
 */
export class Requests extends React.Component<Props> {
  props: Props;

  cache: RequestsSubTreesCache;

  constructor(props: Props) {
    super(props);
    this.cache = createCache()
  }

  componentDidUpdate() {
    const states = this.props.request.data;
    this.cache.cleanSelf(states)
  }

  /**
   * Creates a child using cache first approach
   * @param child React Element
   * @returns {React.Element}
   */
  createSubTree = (child: Object) => {
    const { id, skipOldTrees, request, ...rest } = this.props;

    if (React.isValidElement(child)) {
      // $FlowFixMe
      const childId = id(child.props);

      if (!isRequestId(childId)) {
        return child;
      }

      const childRequestData = request.data[childId];

      const requestIsCached = this.cache.has(childRequestData);

      if (skipOldTrees && requestIsCached) {
        return this.cache.getTree(childRequestData)
      }

      const nextRequest = { data: childRequestData, actions: request.actions };
      const nextProps = overrideRequestProps(
        {
          ...rest,
          request: nextRequest,
          children: child,
        },
        child.props
      );

      const childRequestTree = renderRequestState(nextProps);

      if (skipOldTrees) {
        this.cache.set(childRequestData, childRequestTree);
      }
      return childRequestTree;
    }
    return child;
  };

  render() {
    const { request, children } = this.props;

    if (isEmptyObj(request.data)) return null;

    return React.Children.map(children, this.createSubTree);
  }
}

// $FlowFixMe
Requests.defaultProps = {
  skipOldTrees: true,
};


// $FlowFixMe
export default withRequest({
  id: extractRequestIds,
  mergeIdSources: true,
  keepSingleRequestMap: true,
})(Requests);
