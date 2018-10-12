// @flow
import React from 'react';
import { PendingContainer } from './RequestPendingStyle';
import Spinner from '../Spinner/Spinner';

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
        <PendingContainer>
            <Spinner size={20} color={color} />
        </PendingContainer>
    );
};

export default RequestPending;
