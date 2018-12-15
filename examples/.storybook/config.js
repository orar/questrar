import { configure } from '@storybook/react';
import '@storybook/addon-console';

function loadStories() {
  require('../stories/index.jsx');
  // You can require as many stories as you need.
}

configure(loadStories, module);
