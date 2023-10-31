import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userAuthData: {} as ReadonlySet<any> | null,
};

// Данные о авторизации пользователя

export type AuthoritiesState = Readonly<typeof initialState>;

export const userAuthSlice = createSlice({
  name: 'user',
  initialState: initialState as AuthoritiesState,
  reducers: {
    setUserAuth(state, action) {
      state.userAuthData = action.payload;
    },
  },
});

export const { setUserAuth } = userAuthSlice.actions;
export default userAuthSlice.reducer;
