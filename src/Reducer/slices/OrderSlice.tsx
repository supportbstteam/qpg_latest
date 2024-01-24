import { createSlice } from "@reduxjs/toolkit";
import { saveHistory } from "./SaveOrderHistory";

const bookSlice = createSlice({
    name: "book", // Use a consistent name, lowercase
    initialState: [],
    reducers: {
        addBook: (state, action) => {
            state.push(action.payload);
            saveHistory(action.payload);
        },
    },
});

const totalItemCountSlice = createSlice({
    name: "totalItemCount",
    initialState: 0,
    reducers: {
        setTotalItemCount: (state, action) => action.payload,
        incrementTotalItemCount: (state) => state + 1,
        decrementTotalItemCount: (state) => state - 1,
    },
});

export const { setTotalItemCount, incrementTotalItemCount, decrementTotalItemCount } = totalItemCountSlice.actions;

// Corrected export statement
export const totalItemCountReducer = totalItemCountSlice.reducer;

export const { addBook } = bookSlice.actions;
export default bookSlice.reducer;
