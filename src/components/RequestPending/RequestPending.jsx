// @flow
import React from 'react';
import Spinner from '../Spinner/Spinner';
import './RequestPending.scss';
type Props = {
  color?: string,
}

/**
 * Default loading component to render on request pending/loading
 * @returns {*}
 * @constructor
 */
const RequestPending = ({ color }: Props) => {
    return (
        <div className="pendingContainer">
            <Spinner size={20} color={color} />
        </div>
    );
};

export default RequestPending;
