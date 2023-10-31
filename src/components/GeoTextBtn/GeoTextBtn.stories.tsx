import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GeoTextBtn from './GeoTextBtn';

export default {
  title: 'GeoUI/Buttons/GeoTextBtn',
  component: GeoTextBtn,
  argTypes: {},
} as ComponentMeta<typeof GeoTextBtn>;

const Template: ComponentStory<typeof GeoTextBtn> = (args) => <GeoTextBtn {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Показать все',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  label: 'Добавить фото',
  iconType: 'plus'
};
