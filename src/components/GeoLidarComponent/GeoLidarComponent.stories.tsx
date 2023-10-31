import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GeoLidarComponent } from './GeoLidarComponent';

export default {
  title: 'Lidar/Page',
  component: GeoLidarComponent,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof GeoLidarComponent>;

const Template: ComponentStory<typeof GeoLidarComponent> = (args) => <GeoLidarComponent {...args} />;

export const Example = Template.bind({});

Example.args = {
  url: 'http://localhost:5000/',
  roadId: '89767',
  diagId: '4',
  // coords: '496474.095585806,4989254.9227866,29.6681547162261',
  // lookAt: '496460.022811357,4989176.40441075,32.813473862232',
};
