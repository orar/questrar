// @flow
import React from 'react';
import './RequestLoading.scss';
import Spinner from '../Spinner/Spinner';

type Props = {
  color: string,
}

/**
 * Default loading component to render on request pending/loading
 * @returns {*}
 * @constructor
 */
const RequestLoading = ({ color }: Props) => {
    return (
        <div className="requestLoadingContainer">
            <Spinner size={20} color={color} />
        </div>
    );
};

export default RequestLoading;
