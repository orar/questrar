// @flow
import React, { Component } from 'react';
import { Request } from 'questrar';
import { connect } from 'react-redux';
import { fetchProfileState } from './createStore';
import './Styles.scss';

const RenderProfile = ({ request }) => {
  console.log(request);
  const id = request.data.id;

  const onClick = () => {
    request.actions.failed(id, 'Failed Intentionally');
  };

  if (request.data.failed) {
    return (
      <div className="profileFailed">{request.data.message}</div>
    );
  }

  if (request.data.success) {
    const data = request.data.message;
    return (
      <div className="profileContent">
        <div className="profileInfo">
          <div className="profileItem">
            <span className="label">Name:</span>
            <span>{data.name}</span>
          </div>
          <div className="profileItem">
            <span className="label">Genetic code:</span>
            <span>{data.gcode}</span>
          </div>
          <div className="profileItem">
            <span className="label">Age:</span>
            <span>{data.age}</span>
          </div>
          <div className="profileItem">
            <span className="label">Universe:</span>
            <span>{data.university}</span>
          </div>
          <div className="profileItem">
            <span className="label">Planet:</span>
            <span>{data.homePlanet}</span>
          </div>
          <div className="profileItem">
            <span className="label">Address:</span>
            <span>{data.address}</span>
          </div>
          <div className="profileItem">
            <span className="label">Language:</span>
            <span>{data.language}</span>
          </div>
        </div>
        <div className="profileActions">
          <button onClick={onClick} className="profileFailBtn">Fail</button>
        </div>
      </div>
    );
  }
  return <div>No request state</div>
};


type Props = {
  dispatch: (a: any) => any
}


/**
*
* @author Orar
* @date   9/30/18, 6:48 PM
*/
class Profile extends Component<Props> {
    props: Props;


    componentDidMount() {
      const { dispatch } = this.props;
      dispatch({ type: 'FETCH_PROFILE_INFO' });
    }


    render() {
      return (
        <div style={{ paddingTop: 32 }} className="profileContainer">
          <Request
            inject
            pendOnMount
            id={fetchProfileState.id}
          >
            <RenderProfile />
          </Request>
        </div>
      );
    }
}


const mapStateToProps = (state) => {
  console.log(state);
  return state;
};


export default connect(mapStateToProps)(Profile);
