import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import TodoApp from '../src/todo/App';
import DefaultStoreApp from '../src/store/App';
import PostStoreApp from '../src/context/App';
import DeleteSelfApp from '../src/delete/App';
import '@storybook/addon-console';
import 'semantic-ui-css/semantic.css';


storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  ))
  .add('delete self', () => (
    <DeleteSelfApp />
  ))
  .add('default store 1', () => (
    <PostStoreApp />
  ))
  .add('default store 2', () => (
    <DefaultStoreApp />
  ))
  .add('todo', () => (
    <TodoApp />
  ));
