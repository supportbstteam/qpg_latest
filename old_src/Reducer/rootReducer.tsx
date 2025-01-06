import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import bookReducer, { totalItemCountReducer } from "./slices/OrderSlice";
import { ConfirnOrderData } from "./slices/ConfirmOrderHistory";
import { schoolListData } from "./slices/SchoolSlice";
import resetURLReducer from "./slices/resetURL";



const rootReducer = combineReducers({
    user: userSlice,
    book: bookReducer,
    totalItemCount:totalItemCountReducer ,
    ConfirmAllOrderData:ConfirnOrderData,
    schoolListData: schoolListData, 
    resetURL: resetURLReducer,
});



const store=configureStore({
    reducer:rootReducer
})

export default store;