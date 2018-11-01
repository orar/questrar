// @flow
import React from 'react';
import { isNumber } from '../../module/helper';
import './Spinner.scss';

type Props = {
    size?: number,
}

const Spinner = ({ size }: Props) => {
  const style = {};
  const spinSize = isNumber(size) ? size : 40;
  Object.assign(style, { width: spinSize, height: spinSize });

  const cogs = Array(11).fill(1);

  return (
    <div className="sk-fading-circle" style={style}>
      {cogs.map((c, i) => {
        const className = `sk-circle sk-circle${i + 2}`;
        return <div className={className} key={`key${i}`} />
      })}
    </div>
  );
};

export default Spinner;
