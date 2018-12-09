// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { RequestProp } from 'questrar';
import { Request } from 'questrar';
import { Button, Input, Icon } from 'semantic-ui-react';
import { fetchTodo, addTodo, removeTodo} from './reducers';
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
  onClose: (id: any) => void
}

type Props = {
  data: Array<TodoAction>,
  fetchTodos: () => void,
  addTodo: (todo: TodoAction) => void,
  removeTodo: (id: any) => void,
}


// ======================================================
// TodoForm component
// ======================================================

class TodoForm extends React.Component {
  props;

  state = { action: '', time: '' };

  onSubmit = () => {
    const { onAdd } = this.props;
    if (typeof onAdd === 'function' && this.state.action) {
      onAdd(this.state);
    }
  };

  onChange = (value: any) => {
    if (value.action || value.time) {
      this.setState(value)
    }
  };

  render() {
    const { loading } = this.props;
    console.log('logging')
    return (
      <div className="todoFormContainer">
        <div className="todoFormInput">
          <Input className="todoActionBox" onChange={evt => this.onChange({ action: evt.target.value })} />
          <Input type="number" className="todoTimeBox" onChange={evt => this.onChange({ time: evt.target.value })} />
        </div>
        <Button
          loading={loading}
          type="submit"
          className="todoAddButton"
          onClick={this.onSubmit}
        >
          Add Todo
        </Button>
      </div>
    );
  };
}

// ==============================================================
// TodoItem component
// ==============================================================
const TodoItem = ({ data, onClose }: TodoItemProps) => (
  <div className="todoItemContainer">
    <div className="todoItemTitles">
      <div className="todoItemActionLabel">{data.action}</div>
      <div className="todoItemActionTime">{data.time} pm</div>
      <div className="todoItemActionDone">
        {data.done ? <Icon title="Done" name="check circle outline" /> : null}
      </div>
    </div>
    <div className="todoItemButtons">
      <Icon title="close" onClick={() => onClose(data.id)} name="close" />
    </div>
  </div>
);


// ==============================================================
// Todo component
// ==============================================================
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
    return (
      <div className='todoListWrap tryAgainWrap'>
        <div className="tryAgain">
          <p>{requestProp.data.message}</p>
          <Button size="small" basic onClick={() => this.props.fetchTodos(true)}>Try Again</Button>
        </div>
      </div>
    );
  };

  render() {
    const { data, removeTodo } = this.props;


    return (
      <div className="todoContainer">
        <div className="todoWrapper">
          <div className="todoHeader">My Todo List</div>
          <Request id={fetchTodoState.id} pendOnMount onFailure={this.tryAgain}>
            <div className="todoListWrap">
              {data.map(t => (
                <TodoItem key={t.id} data={t} onClose={removeTodo} />
              ))}
            </div>
          </Request>
          <div className="todoFormWrap">
            <Request id={addTodoState.id} inject={r => ({ loading: r.data.pending })}>
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
  removeTodo: id => dispatch(removeTodo(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoComponent);
