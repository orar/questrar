// @flow
import React from 'react';
import {isNumber} from "../../module/helper";
import './Spinner.scss';

type Props = {
    size: number,
  color?: string,
}

const Spinner = ({ size }: Props) => {
    const style = {};
    const _size = isNumber(size) ? size : 40;
    Object.assign(style, { width: _size, height: _size });

    const cogs = Array(11).fill(1);

    return (
      <div className="sk-fading-circle" style={style} >
        {cogs.map((c, i) => {
          const className  = `sk-circle sk-circle${i + 2}`;
          return <div className={className} key={`${i}`} />
        })}
      </div>
    );
};

export default Spinner;
