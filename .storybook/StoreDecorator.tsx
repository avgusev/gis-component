import React from 'react';
import { Story } from '@storybook/react';
import getStore from '../src/config/store';
import { Provider } from 'react-redux';

const store = getStore();
export const StoreDecorator = (StoryComponent: Story) => (
  <Provider store={store}>
    <StoryComponent />
  </Provider>
);
