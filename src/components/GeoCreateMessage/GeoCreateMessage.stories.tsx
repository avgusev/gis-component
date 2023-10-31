import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GeoCreateMessage from './GeoCreateMessage';

export default {
  title: 'GeoWidgets/GeoCreateMessage',
  component: GeoCreateMessage,
  argTypes: {},
} as ComponentMeta<typeof GeoCreateMessage>;

const Template: ComponentStory<typeof GeoCreateMessage> = (args) => <GeoCreateMessage {...args} />;

export const Default = Template.bind({});
