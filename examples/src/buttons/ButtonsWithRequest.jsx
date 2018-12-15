// @flow
import React from 'react';
import { Request } from 'questrar';
import { Input } from 'semantic-ui-react';
import ButtonBar from './ButtonBar';
import { randomId } from '../helper';
import './Buttons.scss';


type Props = {
  size?: number,
}

type State = {
  size: number,
}

class Buttons extends React.Component<Props, State> {
  props: Props;

  state: State = { size: 2 };


  componentDidMount() {
    this.setState({ size: this.props.size });
  }


  setListSize = (evt: Object) => {
    const size = +evt.target.value;
    if (size >= 1) {
      this.setState({ size });
    }
  };

  render() {
    const { size } = this.state;

    const idList = Array(size).fill(1)
      .map((_, index) => {
        const idr = randomId();
        return `${index + 1}_${idr}`;
      });

    return (
      <div className="buttonsLongListContainer">
        <div className="buttonsToolbar">
          <div className="sizeInput">
            <span>List Length: </span>
            <Input defaultValue={size} size="mini" onChange={this.setListSize} />
          </div>
        </div>
        {idList.map((id, idx) => (
          <Request id={id} key={id} inject>
            <ButtonBar position={idx + 1} />
          </Request>
        ))}
      </div>
    );
  }
}


export default Buttons;
