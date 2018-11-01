// @flow
import React, { Component } from 'react';
import { Request } from 'questrar';
import DeleteButton from './DeleteButton';
import './Common.scss';

type Props = {

}

type State = {
  loading: boolean
}

/**
*
* @author Orar
* @date   9/29/18, 9:36 AM
*/
export class ProfilePage extends Component<Props, State> {
    props: Props;

    state: State = { loading: true };

    id = '102932';

    subId = 'del_102932';

    _timeout = setTimeout(() => {
      this.setState({ loading: false });
    }, 3000);

    render() {
      return (
        <div style={{ height: '150vh'}}>
          <Request id="user02932" initialLoading={this.state.loading}>
            <div>
              <div>Profile</div>
              <div>
                <DeleteButton id={this.subId} />
              </div>
            </div>
          </Request>
        </div>
      );
    }
}


export default ProfilePage;
