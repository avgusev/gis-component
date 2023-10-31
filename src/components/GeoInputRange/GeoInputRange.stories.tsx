import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GeoInputRange from './GeoInputRange';
import '../../variables.scss';
import { StoreDecorator } from '../../../.storybook/StoreDecorator';

export default {
  title: 'GeoUI/GeoInputRange',
  component: GeoInputRange,
  argTypes: {},
} as ComponentMeta<typeof GeoInputRange>;

const Template: ComponentStory<typeof GeoInputRange> = (args) => <GeoInputRange {...args} />;

export const Primary = Template.bind({});

// export const TextRange = Template.bind({});
// TextRange.args = {

//     id="picket-search-range"
//     label=""
//     rangeType="text"
//     // min={0}
//     // max={100}
//     minRequired
//     maxRequired
//     placeholderMin="0+000"
//     placeholderMax="0+000"
//     value={valueRange}
//     onChange={() => setValueRange(valueRange)}
//     onClickHandler={onClickHandler}

// };
