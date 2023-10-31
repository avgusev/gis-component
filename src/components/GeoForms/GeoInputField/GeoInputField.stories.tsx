import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GeoInputField from './GeoInputField';

export default {
  title: 'GeoUI/Form/GeoInputField',
  component: GeoInputField,
  argTypes: {},
} as ComponentMeta<typeof GeoInputField>;

const Template: ComponentStory<typeof GeoInputField> = (args) => <GeoInputField {...args} />;

export const Text = Template.bind({});
Text.args = {
  name: 'test',
  label: 'Тестовый компонент',
  placeholder: 'Тестовый компонент',
  size: 'width_300',
};

export const Date = Template.bind({});
Date.args = {
  name: 'date',
  label: 'Дата',
  type: 'date',
  placeholder: 'Дата',
  size: 'width_300',
  defaultValue: '2022-12-05',
};

export const AdditionEvent = Template.bind({});
AdditionEvent.args = {
  name: 'test',
  label: 'Тестовый компонент',
  placeholder: 'Тестовый компонент',
  size: 'width_300',
  additionIconType: 'find_me',
  additionEvent: () => {
    console.log('Клик');
  },
};
