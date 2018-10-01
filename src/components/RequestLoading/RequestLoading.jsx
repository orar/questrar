// @flow
import React from 'react';
import './RequestLoading.scss';
import Spinner from '../Spinner/Spinner';

type Props = {

}

const RequestLoading = ({}: Props) => {
    return (
        <div className="requestLoadingContainer">
            <Spinner bounceSize={20} />
        </div>
    );
};

export default RequestLoading;
