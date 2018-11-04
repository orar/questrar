// @flow
import React from 'react';
import { isObj } from '../module/helper';

type Props = {
  message: any | { title: any, body: any },
  className?: string,
  titleClassName?: string,
  bodyClassName?: string,
  onClose: () => void,
  escToClose?: boolean,
}

/**
 * Creates a content which is rendered in a popover on success or failure
 * @param message Request status message
 * @param className ClassName
 * @param onClose Function called onClose
 * @param escToClose Allow escape key press to close popover.
 * @param titleClassName Default classname of title if not a custom react node.
 * @param bodyClassName Default classname of message body if not a custom react node.
 *  This would close all popovers on requests
 * @returns {*}
 * @constructor
 */
const PopoverContent = ({
  message,
  className,
  onClose,
  titleClassName,
  bodyClassName,
}: Props) => {
  const msgObject = isObj(message);

  let title = msgObject ? message.title : null;

  if (title) {
    title = React.isValidElement(title) ? title : (
      <div className={titleClassName}>
        {title}
      </div>
    )
  }

  let messageBody = message;

  if (msgObject) {
    messageBody = message.body
  } else {
    messageBody = null
  }

  if (messageBody && !React.isValidElement(messageBody)) {
    messageBody = (
      <div className={bodyClassName}>
        {/* $FlowFixMe */}
        {messageBody}
      </div>
    )
  }

  /* eslint-disable jsx-a11y/interactive-supports-focus */
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  return (
    <div
      role="button"
      className={className}
      onClick={onClose}
    >
      {title}
      {messageBody}
    </div>
  );
};

export default PopoverContent;
