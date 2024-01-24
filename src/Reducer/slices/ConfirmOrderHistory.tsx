import { createSlice } from "@reduxjs/toolkit";

const ConfirnOrder=createSlice({
    name:"OrderHistory",
    initialState:[],
    reducers:{
        setTotalOrderHistory: (state, action) => action.payload,
    }
})

export const {setTotalOrderHistory}=ConfirnOrder.actions
export const ConfirnOrderData=ConfirnOrder.reducer

export const selectOrderById = (state, orderId) => {
    return state.ConfirmAllOrderData.find(order => order.id === orderId);
  };
