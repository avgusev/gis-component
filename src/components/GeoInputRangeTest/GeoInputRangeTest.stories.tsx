import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GeoInputRangeTest from './GeoInputRangeTest';
import '../../variables.scss';

export default {
  title: 'GeoUI/GeoInputRangeTest',
  component: GeoInputRangeTest,
  decorators: [
    () => {
      const [value, onChange] = useState<string[] | number[]>([undefined, undefined]);
      return (
        <GeoInputRangeTest
          onChange={onChange}
          value={value}
          label="Тестовый компонент"
          id="range"
          rangeType="text"
          size="width300"
          placeholderMax="100+500"
          placeholderMin="0+500"
          tooltipPlacement="right"
          isMinRequired={true}
          isMaxRequired={true}
        />
      );
    },
  ],
  argTypes: {},
} as ComponentMeta<typeof GeoInputRangeTest>;

const Template: ComponentStory<typeof GeoInputRangeTest> = (args) => <GeoInputRangeTest {...args} />;

export const Primary = Template.bind({});

// Primary.args = {
//   label: 'Тестовый компонент',
//   id: 'range',
//   rangeType: 'text',
//   min: 0,
//   max: 10,
//   step: 1,
//   size: 'width300',
//   placeholderMax: 10,
//   placeholderMin: 0,
// };
