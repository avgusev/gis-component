import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GeoTextareaInput from './GeoTextareaInput';

export default {
  title: 'GeoUI/Form/GeoTextareaInput',
  component: GeoTextareaInput,
  argTypes: {},
} as ComponentMeta<typeof GeoTextareaInput>;

const Template: ComponentStory<typeof GeoTextareaInput> = (args) => <GeoTextareaInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'test',
  label: 'Тестовый компонент',
  placeholder: 'Тестовый компонент',
  size: 'width_300',
};
