import { createSlice } from "@reduxjs/toolkit";

let authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        isloading:false,
    },
    reducers:{
        addUser : (state,action) => {
            state.payload = action.payload;
            state.isloading = false;
        },
        removeUser :(state) => {
            state.user = null,
            state.isloading = false;
        },
    }
})

let {addUser,removeUser} = authSlice.actions;
export default authSlice.reducer;