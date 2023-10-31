import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GeoDoubleRangeSlider from './GeoDoubleRangeSlider';
import '../../variables.scss';
// import { StoreDecorator } from '../../../.storybook/StoreDecorator';

export default {
  title: 'GeoUI/GeoDoubleRangeSlider',
  component: GeoDoubleRangeSlider,
  // decorators : [StoreDecorator({})],
  argTypes: {},
} as ComponentMeta<typeof GeoDoubleRangeSlider>;

const Template: ComponentStory<typeof GeoDoubleRangeSlider> = (args) => <GeoDoubleRangeSlider {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  min: 2021,
  max: 2036,
  step: 1,
};

export const Gradient = Template.bind({});
Gradient.args = {
  sliderName: 'lyr_road_conditions_lanes',
  min: 1,
  max: 10,
  step: 1,
  stepCount: 5,
};

export const Сapacity = Template.bind({});
Сapacity.args = {
  sliderName: 'lyr_road_conditions_capacity',
  min: 0,
  max: 100000,
  step: 10000,
  stepCount: 5,
};

export const NoRange = Template.bind({});
NoRange.args = {
  sliderName: 'lyr_road_conditions_lanes',
  min: 1,
  max: 10,
  step: 1,
  stepCount: 5,
  hideRange: true,
};
// onlyTitle.decorators = [StoreDecorator({})];
