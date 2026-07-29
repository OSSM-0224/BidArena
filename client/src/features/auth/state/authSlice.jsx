import { createSlice } from "@reduxjs/toolkit";
import { currentLoggedUser, loginUser, registerUser } from "../api/auth.api";

const AddAuthCase = (builder, thunk) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.isloading = true;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isloading = false;
    })
    .addCase(thunk.rejected, (state) => {
      state.isloading = false;
    });
};

let authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isloading: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      state.isloading = false;
    },
    removeUser: (state) => {
      ((state.user = null), (state.isloading = false));
    },
  },
  extraReducers: (builder) => {
    AddAuthCase(builder, loginUser);
    AddAuthCase(builder, registerUser);
    AddAuthCase(builder, currentLoggedUser);
  },
});

export let { addUser, removeUser } = authSlice.actions;
export default authSlice.reducer;
