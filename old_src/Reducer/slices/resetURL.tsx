import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  deepLinkUrl: null,
};

//this will store the deep link url, to use it in the app only once which launching the app
const resetURLSlice = createSlice({
  name: 'resetURL',
  initialState,
  reducers: {
    resetURL: state => {
      state.deepLinkUrl = null;
    },
    setURL: (state, action) => {
      state.deepLinkUrl = action.payload;
    },
  },
});

export const {resetURL, setURL} = resetURLSlice.actions;
export default resetURLSlice.reducer;
