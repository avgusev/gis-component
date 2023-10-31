import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import StatFormList from './StatFormList';

export default {
  title: 'GeoWidgets/GeoStatForms/StatFormList',
  component: StatFormList,
} as ComponentMeta<typeof StatFormList>;

const Template: ComponentStory<typeof StatFormList> = () => <StatFormList />;

export const Primary = Template.bind({});
