/* eslint-disable no-param-reassign */
import {
  AnyAction,
  AsyncThunk,
  ActionReducerMapBuilder,
  createSlice,
  SerializedError,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

/**
 * Модель для redux actions с пагинацией
 */
export type IQueryParams = { subjectCode?: string; start?: number; size?: number; sort?: 'asc' | 'desc'; search?: string };
export type IQueryFiltersParams = {
  search?: string;
  selected?: number[];
  max_level?: 1 | 2 | 3 | 4 | 5 | 6;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

/**
 * Полезные типы для работы с actions
 */
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
export type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
export type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;

/**
 * Проверка, если async action type отклонен
 */
export function isRejectedAction(action: AnyAction) {
  return action.type.endsWith('/rejected');
}

/**
 * Проверка, находится ли async action type в стадии ожидания
 */
export function isPendingAction(action: AnyAction) {
  return action.type.endsWith('/pending');
}

/**
 * Проверка, завершено ли async action type
 */
export function isFulfilledAction(action: AnyAction) {
  return action.type.endsWith('/fulfilled');
}

const commonErrorProperties: Array<keyof SerializedError> = ['name', 'message', 'stack', 'code'];

/**
 * Функция сериализации, используемая для ошибок async action,
 * поскольку функция по умолчанию из Redux Toolkit удаляет полезную информацию из ошибок axios
 */
export const serializeAxiosError = (value: any): AxiosError | SerializedError => {
  if (typeof value === 'object' && value !== null) {
    if (value.isAxiosError) {
      return value;
    }
    const simpleError: SerializedError = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const property of commonErrorProperties) {
      if (typeof value[property] === 'string') {
        simpleError[property] = value[property];
      }
    }

    return simpleError;
  }
  return { message: String(value) };
};

export interface EntityState<T> {
  loading: boolean;
  errorMessage: string | null;
  entities: ReadonlyArray<T>;
  entity: T;
  links?: any;
  updating: boolean;
  totalItems?: number;
  updateSuccess: boolean;
}

/**
 * Обертка поверх createSlice из Redux Toolkit для извлечения
 * общие reducers и matchers, используемые сущностями
 */
export const createEntitySlice = <T, Reducers extends SliceCaseReducers<EntityState<T>>>({
  name = '',
  initialState,
  reducers,
  extraReducers,
  skipRejectionHandling,
}: {
  name: string;
  initialState: EntityState<T>;
  reducers?: ValidateSliceCaseReducers<EntityState<T>, Reducers>;
  extraReducers?: (builder: ActionReducerMapBuilder<EntityState<T>>) => void;
  skipRejectionHandling?: boolean;
}) =>
  createSlice({
    name,
    initialState,
    reducers: {
      /**
       *  Сброс состояния в исходное состояние
       */
      reset() {
        return initialState;
      },
      ...reducers,
    },
    extraReducers(builder) {
      // @ts-ignore
      extraReducers(builder);
      /*
       * Здесь обрабатывается общая логика отказов
       * Если вы хотите добавить свою собственную логику отбраковки, передайте `skipRejectionHandling: true`
       * при вызове `createEntitySlice`
       * */
      if (!skipRejectionHandling) {
        builder.addMatcher(isRejectedAction, (state, action) => {
          state.loading = false;
          state.updating = false;
          state.updateSuccess = false;
          state.errorMessage = action.error.message ?? `невозможно получить ошибку`;
        });
      }
    },
  });
