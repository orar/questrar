// @flow
import React, { Component } from 'react';
import  Request  from "components/Request";
import { fetchProfileState } from "./createStore";
import type {RequestState} from "../../src/QuestrarTypes";
import './Styles.scss';
import { connect } from 'react-redux';
import { REQUEST_ACTION_TYPE } from "../../src/module/common";


const RenderProfile = ({ request }) => {
  if(request.data.success){
    const data = request.data.message;
    return (
      <div className="profileContent" >
        <div>Name: {data.name}</div>
        <div>Age: {data.age}</div>
        <div>Universe: {data.university}</div>
        <div>Planet: {data.homePlanet}</div>
        <div>Address: {data.address}</div>
        <div>Spoken Lang: {data.oralLanguage}</div>
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
    this.props.dispatch({ type: 'FETCH_PROFILE_INFO' })
  }



    render() {
        return (
            <div className="profileContainer">
              <Request id={fetchProfileState.id} initialLoading inject >
                <RenderProfile />
              </Request>
            </div>
        );
    }
}


//We are using redux-saga and we need to dispatch an action which to be taken by the saga worker function
const mapStateToProps = (state) => {
  console.log(state);
  return { data: state[REQUEST_ACTION_TYPE] }
};


export default connect(mapStateToProps)(Profile);
