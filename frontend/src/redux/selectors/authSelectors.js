// src/redux/authSelectors.js

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectUser = (state) => state.auth.user;
