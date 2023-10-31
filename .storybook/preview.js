// Так мы добавляем глобальные стили
import '../src/styles.scss';
import '../src/assets/style-mocks/_skdf-colors.scss';
import '../src/assets/style-mocks/_bs_variable_overrides.scss';
import '../src/assets/style-mocks/_bs_custom.scss';
import '../src/assets/style-mocks/bs_skdf.scss';
import { addDecorator } from '@storybook/react';
import { StoreDecorator } from './StoreDecorator.tsx';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

addDecorator(StoreDecorator);
