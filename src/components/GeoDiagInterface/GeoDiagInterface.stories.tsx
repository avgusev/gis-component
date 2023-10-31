import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GeoDiagInterface from './GeoDiagInterface';

export default {
  title: 'GeoWidgets/GeoDiagInterface',
  component: GeoDiagInterface,
  argTypes: {},
} as ComponentMeta<typeof GeoDiagInterface>;

const Template: ComponentStory<typeof GeoDiagInterface> = (args) => <GeoDiagInterface {...args} />;

export const Default = Template.bind({});
Default.args = {
  roadId: null,
};
