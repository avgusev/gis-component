import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GeoIconButton from './GeoIconButton';
import './GeoIconButton.scss';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'GeoUI/Buttons/IconButton',
  component: GeoIconButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  // argTypes: {
  //   content: { control: 'color' },
  // },
} as ComponentMeta<typeof GeoIconButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GeoIconButton> = (args) => <GeoIconButton {...args} />;

export const Print = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Print.args = {
  content: 'Печать',
  iconType: 'printer',
};

export const ArrowRight = Template.bind({});
ArrowRight.args = {
  iconType: 'arrow-right',
};

export const ArrowLeft = Template.bind({});
ArrowLeft.args = {
  iconType: 'arrow-left',
};

export const Plus = Template.bind({});
Plus.args = {
  name: 'plus',
  iconType: 'plus',
};

export const Minus = Template.bind({});
Minus.args = {
  name: 'minus',
  iconType: 'minus',
};
