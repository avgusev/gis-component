import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GeoZoomButton from './GeoZoomButton';

export default {
  title: 'GeoUI/Buttons/GeoZoomButton',
  component: GeoZoomButton,
} as ComponentMeta<typeof GeoZoomButton>;

const Template: ComponentStory<typeof GeoZoomButton> = () => <GeoZoomButton />;

export const Primary = Template.bind({});
