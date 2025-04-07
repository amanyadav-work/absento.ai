import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/userReducer';  // Import userReducer

const store = configureStore({
  reducer: {
    user: userReducer,  // Add user slice to the store
  },
});

export default store;
