// @flow
import React from 'react';
import { Button, TextArea, Popup } from 'semantic-ui-react';
import { withRequest, Request } from 'questrar';
import type { RequestProp } from 'questrar';
import { randomId } from '../helper';

type Props = {
  state: Object,
  setState: (obj: Object) => void,
  request: RequestProp
};

type State = {
  loading: boolean,
  posts: Array<Object>,
  text?: string,
}

const initialPosts = [
  { title: 'Alien on Mars', body: "I'm no fan of the artist but what he's done really deserves appreciation" },
  { title: 'Javascript of 2018', body: 'You dont get it. This is just a face-over act to let people have empathy on him. He is a liar' },
  { title: 'New spaceship set to land on Jupiter', body: 'Hold it right there. I guess you all arent talking about my fav' },
];

class Post extends React.Component<Props, State> {
  props: Props;

  state: State = { posts: initialPosts, loading: true };

  timeout = () => setTimeout(() => {
    this.setState({ loading: false });
  }, 3000);

  componentDidMount() {
    this.timeout();
  }

  posts = () => this.state.posts.map((p, i) => (
    <div key={`${i}`} className="postItemContainer">
      <div className="postItemHeader">{p.title}</div>
      <div className="postItemBody">{p.body}</div>
    </div>
  ));

  onClick = () => {
    const { request } = this.props;

    if (this.state.text) {
      request.actions.pending(request.data.id);

      setTimeout(() => {
        this.setState({
          posts: this.state.posts.concat([{
            title: 'Mecury has one day, one year',
            body: this.state.text,
          }]),
        });
        /* eslint-disable-next-line max-len */
        request.actions.success(request.data.id,
          {
            title: 'Your First Post?',
            body: "It's our pride to unveil this new popup on our page giving you a nice instant request feedback on what you need to know albeit not neccessary",
          });
      }, 2000);
    }
  };

  onRequestSuccess (request, buttonEl) {
    this.setState({ });
    // console.log('Setting state');

    return (
      <React.Fragment>
        {buttonEl}
        <Popup
          onClick={() => request.actions.remove(request.data.id)}
          context={buttonEl.ref}
          open
          header={request.data.message.title}
          content={request.data.message.body}
          placement="right center"
        />
      </React.Fragment>
    );
  }
  onRequestSuccess = this.onRequestSuccess.bind(this);

  render() {
    const { request } = this.props;

    return (
      <Request id="someId" pendOnMount={this.state.loading}>
        <div className="postContainer">
          <div className="postsListWrap">
            {this.posts()}
          </div>
          <div className="postActions">
            <TextArea
              className="textArea"
              value={this.state.text}
              onChange={(evt, text) => this.setState({ text: text.value })}
              placeholder="Say something about the discussion"
            />
            <Request
              id={request.data.id}
              onSuccess={this.onRequestSuccess}
              inject={r => ({loading: r.data.pending })}
            >
              <Button
                className="postButton"
                onClick={this.onClick}
                content="Add New Post"
                size="small"
              />
            </Request>
          </div>
        </div>
      </Request>
    );
  };
}


export default withRequest({ id: randomId() })(Post);
