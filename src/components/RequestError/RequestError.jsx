// @flow
import React from 'react';
import { findDOMNode } from 'react-dom';
import type { Node } from 'react';
import './RequestError.scss';
import type {Request, RequestActions} from "../../index";
import Tooltip from 'tooltip.js';
import { Manager, Reference, Popper } from 'react-popper';


type Props = {
  id: string,
  request: Request,
  actions: RequestActions,
  failure?: boolean | string,
  children: Array<Node> | Node,
  errorTooltip?: boolean,
  onCloseError?: (data: any) => any,
  inject?: boolean | (request: Request) => Object,

}

type State = {
  disabled: boolean
}


/**
 * Error state automatically replaces children with default error message or custom.
 * Implementation of noErrorReplace turns this feature off
 * TODO: noErrorReplace: Render children even if error
 */
class RequestError extends React.Component<Props, State> {
  props: Props;
  state: State = { disabled: true };

  // Element ref on which a tooltip is attached to.
  _ref; //= React.createRef();

  _tooltip: Tooltip;


  componentWillUnmount() {
    if(this._tooltip){
     this._closeTooltip();
    }
  }


  /**
   * Sets the ref of the wrapping error node
   * @param ref
   * @private
   */
  _setRef = (ref: Node) => {
    console.log('setting ref');
    this.setState({ disabled: false });
    this._ref = ref;

    this._createTooltip({});
  };

  /**
   * Close and dispose tooltip
   * @private
   */
  _closeTooltip = () => {
    const { id, actions, onCloseError } = this.props;
    if( this._tooltip._isOpen && typeof onCloseError === "function"){
      onCloseError(id);
    }
    this._tooltip.hide();
    this._tooltip.dispose();
    //actions.remove(id);
  };



  _children = () => {
    const { children, request, inject, actions } = this.props;
    const injection = { request: { data: request, actions }};

    if(React.isValidElement(children)) {
      //Map requestState to child props via inject function
      if(typeof inject === 'function'){
        const params = inject(injection);
        const paramProps = params && typeof params === 'object' ? params : { request: params };
        //$FlowFixMe
        return React.cloneElement(children, paramProps);
      }
      if(inject){//$FlowFixMe
        return React.cloneElement(children, injection);
      }
    }
    return children;
  };


  /**
   * Adjust placement position of tooltip
   * @private
   */
  _adjustPosition = () => {
    if (this._ref) {
      this._ref.getBoundingClientRect()
    }
  };

  /**
   * Creates a success reporting tooltip around child component
   *
   * @returns {Tooltip}
   * @private
   */
  _createTooltip = (options: Object) => {
    const _options = options;
    _options.html = true;
    _options.trigger = '';
    _options.placement = 'top';
    //_options.title = <div onClick={this._closeTooltip}>{this.props.request.message}</div>;
    _options.title = this.props.request.message;

    const domNode = findDOMNode(this._ref);
    this._tooltip = new Tooltip(domNode, _options);
    this._tooltip.show();
  };


  _tooltipp = (t) => {
    console.log(t);
    return (
      <div ref={t.ref} style={t.style} data-placement={t.placement}>
        {this.props.request.message}
        <div ref={t.arrowProps.ref} style={t.arrowProps.style}/>
      </div>
    )
  };

  render() {
    const {id, errorTooltip, request} = this.props;

    if (errorTooltip && request.message) {

      return (
        <Manager>
          <Reference>
            {({ ref }) => (
              <span ref={ref} >
          {this._children()}
          </span>
            )}
          </Reference>
          <Popper
            placement="top"
            modifiers={{ preventOverflow: { enabled: false } }}
            eventsEnabled={true}
            positionFixed={false}
          >
            {this._tooltipp}
          </Popper>
        </Manager>
      );
    }


    if(request.message) {
      return (
        <div className="requestErrorContainer">
          <div>{request.message}</div>
        </div>
      );
    }

    return (
      <div className="requestErrorContainer">
        <div>An error occurred. Please try again later.</div>
      </div>
    );

  };
}

export default RequestError;
