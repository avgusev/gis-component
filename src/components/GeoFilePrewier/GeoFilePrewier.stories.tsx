import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GeoFilePrewier from './GeoFilePrewier';

export default {
  title: 'GeoUI/GeoFilePrewier',
  component: GeoFilePrewier,
  argTypes: {},
} as ComponentMeta<typeof GeoFilePrewier>;

const Template: ComponentStory<typeof GeoFilePrewier> = (args) => <GeoFilePrewier {...args} />;

export const Default = Template.bind({});
Default.args = {
  url: 'https://arthive.net/res/media/img/oy800/ref/224/280235.webp',
  filename: 'IMG_8463.png',
  onClick: () => {},
};
