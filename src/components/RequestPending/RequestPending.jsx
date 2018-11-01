// @flow
import React from 'react';
import Spinner from '../Spinner/Spinner';
import './RequestPending.scss';

type Props = {
  size?: number,
}

/**
 * Default loading component to render on request pending/loading
 * @returns {*}
 * @constructor
 */
const RequestPending = ({ size }: Props) => (
  <div className="pendingContainer">
    <Spinner size={size} />
  </div>
);

export default RequestPending;
