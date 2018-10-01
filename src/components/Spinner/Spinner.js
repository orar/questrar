// @flow
import React from 'react';
import './Spinner.scss';
import {isNumber} from "../../module/helper";


type Props = {
    size: number
}

const Spinner = ({ size, color }: Props) => {
    const style = {};
    const _size = isNumber(size) ? size : 40;

    Object.assign(style, { width: _size, height: _size });


    return (
      <div style={style} className="sk-fading-circle">
        <div style={style} className="sk-circle1 sk-circle"></div>
        <div style={style} className="sk-circle2 sk-circle"></div>
        <div style={style} className="sk-circle3 sk-circle"></div>
        <div style={style} className="sk-circle4 sk-circle"></div>
        <div style={style} className="sk-circle5 sk-circle"></div>
        <div style={style} className="sk-circle6 sk-circle"></div>
        <div style={style} className="sk-circle7 sk-circle"></div>
        <div style={style} className="sk-circle8 sk-circle"></div>
        <div style={style} className="sk-circle9 sk-circle"></div>
        <div style={style} className="sk-circle10 sk-circle"></div>
        <div style={style} className="sk-circle11 sk-circle"></div>
        <div style={style} className="sk-circle12 sk-circle"></div>
      </div>
    );
};

export default Spinner;
