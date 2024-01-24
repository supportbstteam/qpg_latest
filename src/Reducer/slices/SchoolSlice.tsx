import { createSlice } from "@reduxjs/toolkit";

const schoolListSlice = createSlice({
  name: "SchoolList",
  initialState: [],
  reducers: {
    setSchoolList: (state, action) => action.payload,
    addSchool: (state, action) => {
      state.push(action.payload); // Adds the new user report to the array
    },
    updateSchoolById: (state, action) => {
      const updatedSchool = action.payload;
      const index = state.findIndex((item) => item.id === updatedSchool.id);
      if (index !== -1) {
        state[index] = updatedSchool;
      }
    },
  },
});


export const { setSchoolList, updateSchoolById,addSchool } = schoolListSlice.actions;
export const schoolListData = schoolListSlice.reducer;

export const selectSchoolById = (state, Id) => {
  return state.schoolListData.find((item) => item.id === Id);
};
