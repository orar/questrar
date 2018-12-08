// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import type { Node } from 'react';
import invariant from 'invariant';
import isFunc from '../utils/isFunc';
import withRequest from '../module/withRequest';
import RequestFactory from './RequestFactory';
import type { RequestListProp, RequestProp, RequestState } from '../index';
import extractRequestIds from '../utils/extractRequestIds';
import overrideRequestProps from '../utils/overrideRequestProps';
import isRequestId from '../utils/isRequestId';


type Props = {
  id?: (props: Object) => string|number,
  children?: Array<Node>,
  request: RequestListProp,

  pendOnMount?: Node | (r: RequestProp, children?: Node) => Node | boolean,
  onFailure?: Node | (r: RequestProp, children?: Node) => Node,
  onSuccess?: Node | (r: RequestProp, children?: Node) => Node,
  inject?: boolean | (request: RequestProp) => Object,

  fast?: boolean,
  skipSafeTrees: boolean,
}

type State = {
  request: {[key: string|number]: RequestState }
}

export class Requests extends React.Component<Props, State> {
  props: Props;

  state: State = { request: {} };

  static defaultProps = {
    id: (props: Object) => props.id
  };

  constructor(props: Props) {
    invariant(
      isFunc(props.id),
      `Expected 'id' prop to be a function, instead found a ${typeof props.id}`
    );
    super(props);
  }

  shouldComponentUpdate(nextProps: Props) {
    const { fast, request } = this.props;

    if (fast) {
      return (nextProps.request.data !== request.data);
    }
    return nextProps !== this.props
  }


  render() {
    const { id, fast, request, children, ...rest } = this.props;
    /* eslint-disable-next-line prefer-destructuring */
    const state = this.state;

    const tree = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const childId = child.props.requestFactoryType ? child.props.id : id(child.props);
        if (!isRequestId(childId)) {
          return child;
        }
        const requestIsCached = Object.hasOwnProperty.call(state.request, childId);

        if (fast && requestIsCached && state.request[childId] === request.data[childId]) {
          return child
        }

        const childRequest = request.data[childId];
        const nextRequest = { data: childRequest, actions: request.actions };
        const nextProps = overrideRequestProps({
          ...rest,
          request: nextRequest,
          children: child,
        }, child.props);
        return RequestFactory(nextProps)
      }
      return child;
    });

    this.setState({ request: request.data });

    return tree;
  }
}

// $FlowFixMe
export default withRequest({ id: extractRequestIds })(Requests);
