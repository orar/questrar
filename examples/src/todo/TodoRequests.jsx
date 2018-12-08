// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { RequestProp } from 'questrar';
import { Request, Requests } from 'questrar';
import { Button, Input, Icon } from 'semantic-ui-react';
import { fetchTodo, addTodo, removeAllTodo} from './reducers';
import { randomId } from '../helper';
import { addTodoState, fetchTodoState } from './requestStates';
import './Styles.scss';

// ======================================================
// Types
// ======================================================

type TodoAction = {
  id: string,
  action: string,
  time: string,
  done: boolean
}

type TodoItemProps = {
  data: TodoAction,
  loading?: boolean,
  disabled?: boolean
}

type Props = {
  data: Array<TodoAction>,
  request: RequestProp,
  fetchTodos: () => void,
  addTodo: (todo: TodoAction) => void,
  removeAllTodos: () => void,
}


// ======================================================
// Components
// ======================================================

class TodoForm extends React.Component {
  props;

  state;

  onSubmit = () => {
    const { onAdd } = this.props;
    if (typeof onAdd === 'function' && this.state.action) {
      onAdd(this.state);
    }
  };

  onChange = value => {
    this.setState(value)
  };

  render() {
    return (
      <div className="todoFormContainer">
        <div className="todoFormInput">
          <Input className="todoActionBox" onChange={evt => this.onChange({ action: evt.target.value })} />
          <Input type="number" className="todoTimeBox" onChange={evt => this.onChange({ time: evt.target.value })} />
        </div>
        <Button type="submit" className="todoAddButton" onClick={this.onSubmit}>Add Todo</Button>
      </div>
    );
  };
}

const TodoItem = ({ data, loading }: TodoItemProps) => (
  <div className="todoItemContainer">
    <div className="todoItemTitles">
      <div className="todoItemActionLabel">{data.action}</div>
      <div className="todoItemActionTime">{data.time}</div>
      <div>{data.done ? <Icon name="check circle outline" /> : null}</div>
    </div>
    <div className="todoItemButtons">
      {!loading && <Icon loading name="circle notch" />}
      {loading && <Icon loading name="circle notch" />}
    </div>
  </div>
);

class TodoComponent extends React.Component<Props> {
  props: Props;


  componentDidMount() {
    const { data, fetchTodos } = this.props;
    if (data.length === 0) {
      fetchTodos();
    }
  }

  onAdd = (action) => {
    this.props.addTodo(action);
  };

  tryAgain = (requestProp) => {
    console.log(requestProp);
    return (
      <div className='todoListWrap tryAgainWrap'>
        <div className="tryAgain">
          <p>{requestProp.data.message}</p>
          <Button onClick={() => this.props.fetchTodos(true)}>Try Again</Button>
        </div>
      </div>
    );
  };

  inject = (r) => {
    console.log(r);
    r.actions.success(r.data.id);
    return { title: r.data.id };
  };

  render() {
    const { data } = this.props;

    return (
      <div className="todoContainer">
        <div className="todoWrapper">
          <div className="todoHeader">My Todo List</div>
          <Request id={fetchTodoState.id} pendOnMount onFailure={this.tryAgain} inject={this.inject}>
            <div className="todoListWrap">
              <Requests id={props => props.id} inject>
                {data.map(t => (
                  <TodoItem id={t.id} key={t.id} data={t} />
                ))}
              </Requests>
            </div>
          </Request>
          <div className="todoFormWrap">
            <Request id={addTodoState.id} inject>
              <TodoForm onAdd={this.onAdd} />
            </Request>
          </div>
        </div>
      </div>
    );
  }
}


// ======================================================
// Container
// ======================================================

const mapStateToProps = state => ({
  data: state.todo.data,
});

const mapDispatchToProps = dispatch => ({
  fetchTodos: data => dispatch(fetchTodo(data)),
  addTodo: data => dispatch(addTodo({ ...data, id: randomId() })),
  removeAllTodos: () => dispatch(removeAllTodo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoComponent);
