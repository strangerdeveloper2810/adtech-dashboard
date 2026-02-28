import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storage } from '../../utils/storage';
import type { User, AuthTokens, AuthState } from '../../types';

const initialState: AuthState = {
  user: storage.getUser<User>(),
  accessToken: storage.getAccessToken(),
  refreshToken: storage.getRefreshToken(),
  isAuthenticated: !!storage.getAccessToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthTokens>) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      storage.setUser(user);
      storage.setAccessToken(accessToken);
      storage.setRefreshToken(refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      storage.clearAuth();
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      storage.setAccessToken(action.payload);
    },
  },
});

export const { setCredentials, logout, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
