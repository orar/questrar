// @flow
import React from 'react';
import { Requests } from 'questrar';
import { Input, Radio } from 'semantic-ui-react';
import ButtonBar from './ButtonBar';
import { randomId } from '../helper';
import './Buttons.scss';


type Props = {
  size?: number,
}

type State = {
  size: number,
  skip: boolean
}

class ButtonsWithRequests extends React.Component<Props, State> {
  props: Props;

  state: State = { size: 2, skip: true };


  componentDidMount() {
    this.setState({ size: this.props.size });
  }


  setListSize = (evt: Object) => {
    const size = +evt.target.value;
    if (size >= 1) {
      this.setState({ size });
    }
  };

  toggleSkip = (e, { checked }) => {
    this.setState({ skip: checked });
  };

  render() {
    const { size, skip } = this.state;

    const idList = Array(size).fill(1)
      .map((_, index) => {
        const idr = randomId();
        return `${index + 1}_${idr}`;
      });

    return (
      <div className="buttonsLongListContainer">
        <div className="buttonsToolbar">
          <div className="skipRadio">
            <Radio
              slider
              defaultChecked={skip}
              onChange={this.toggleSkip}
              label={skip ? 'Skip Old Trees' : 'Re-render Always'}
            />
          </div>
          <div className="sizeInput">
            <span>List Length: </span>
            <Input defaultValue={size} size="mini" onChange={this.setListSize} />
          </div>
        </div>
        <Requests skipOldTrees={skip} inject>
          {idList.map((id, idx) => (
            <ButtonBar position={idx + 1} key={id} id={id} />
          ))}
        </Requests>
      </div>
    );
  }
}


export default ButtonsWithRequests;
