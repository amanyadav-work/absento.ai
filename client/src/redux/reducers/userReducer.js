import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;  // Replace the entire user object with the payload
    },
    updateUser: (state, action) => {
      const { key, value } = action.payload;
      state.user[key] = value;  // Update the dynamic field in the user object
    },
  },
});

export const { setUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
