// @flow
import React from 'react';
import {isNumber} from "../../module/helper";
import { Gear, Cog } from "./SpinnerStyle";


type Props = {
    size: number,
  color?: string,
}

const Spinner = ({ size, color }: Props) => {
    const style = {};
    const _size = isNumber(size) ? size : 40;
    Object.assign(style, { width: _size, height: _size });

    const cogs = Array(11).fill(1);


    return (
      <Gear style={style} >
        {cogs.map((c, i) => {
            const rotate = (i + 1) * 30;
            const delay = (cogs.length - i) * -1 / 10; // -1.1, -1.0, -0.9, -0.8 ... -0.1
            return <Cog key={`${i}`} rotate={rotate} delay={delay} color={color} />
        })}
      </Gear>
    );
};

export default Spinner;
