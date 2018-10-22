import React from 'react';
import ReactDom from 'react-dom';
import App from './context/App';


const MOUNT_NODE = document.getElementById('app');

const AppTest = () => <div>This is a react component</div>;

let render = () => {
  try {
    ReactDom.render(
      <App />,
      MOUNT_NODE
    );
  } catch (e) {
    console.error(e);
  }
};

render();
