import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GeoSingleSelect from './GeoSingleSelect';

export default {
  title: 'GeoUI/Form/GeoSingleSelect',
  component: GeoSingleSelect,
  argTypes: {},
} as ComponentMeta<typeof GeoSingleSelect>;

const Template: ComponentStory<typeof GeoSingleSelect> = (args) => <GeoSingleSelect {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'test',
  label: 'Тестовый компонент',
  placeholder: 'Тестовый компонент',
  size: 'width_300',
  options: [
    { label: 'Первое значение', value: 1 },
    { label: 'Второе значение', value: 2 },
    { label: 'Третье значение', value: 3 },
  ],
};
