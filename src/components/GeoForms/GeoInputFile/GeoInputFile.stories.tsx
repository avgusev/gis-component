import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GeoInputFile from './GeoInputFile';

export default {
  title: 'GeoUI/Form/GeoInputFile',
  component: GeoInputFile,
  argTypes: {},
} as ComponentMeta<typeof GeoInputFile>;

const Template: ComponentStory<typeof GeoInputFile> = (args) => <GeoInputFile {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: 'width_300',
  accept: '.jpg, .jpeg, .png',
  label: 'Фото',
};
