// @flow
import React from 'react';
import { nonEmpty,isObj } from '../module/helper';

type Props = {
  message?: any | { title: any, body: any },
  defaultMessage?: any,
  className?: string
}

const Banner = ({ message, defaultMessage, className }: Props) => {
  const hasMessage = nonEmpty(message);
  const isMsgObj = isObj(message);
  const isValidEl = hasMessage && React.isValidElement(message);

  const defaultMsg = defaultMessage || 'Successful';

  if (isValidEl) {
    return message;
  }

  if (isMsgObj) {
    return (
      <div className={className}>
        {message.title}
        {message.body}
      </div>
    )
  }

  if (hasMessage) {
    return (
      <div className={className}>
        {message}
      </div>
    )
  }

  return (
    <div className={className}>
      {defaultMsg}
    </div>
  );
};

export default Banner;
