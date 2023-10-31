import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import StatFormPageHeader from './StatFormPageHeader';

export default {
  title: 'GeoWidgets/GeoStatForms/StatFormPageHeader',
  component: StatFormPageHeader,
} as ComponentMeta<typeof StatFormPageHeader>;

const Template: ComponentStory<typeof StatFormPageHeader> = () => <StatFormPageHeader />;

export const Primary = Template.bind({});
