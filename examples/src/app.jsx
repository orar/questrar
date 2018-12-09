import React from 'react';
import ReactDom from 'react-dom';
import App from './context/App';
import 'semantic-ui-css/semantic.css';

/* eslint-disable no-undef */
const MOUNT_NODE = document.getElementById('app');


const render = () => {
  try {
    ReactDom.render(
      <App />,
      MOUNT_NODE,
    );
  } catch (e) {
    console.error(e);
  }
};

render();
