import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/lib/axiosInstance";

export let loginEmployee = createAsyncThunk("auth/login",async (credentials,thunkApi) => {
  try {
    let res = await axiosInstance.post("/auth/login",credentials);
    console.log(res);
    return res.data.data;
  } catch (error) {
      return thunkApi.rejectWithValue(error);
  }
});

export let registerEmployee = createAsyncThunk("auth/register",async (credentials,thunkApi) => {
  try {
    let res = await axiosInstance.post('/auth/register',credentials);
    console.log(data);
    return res.data.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
})

export let currentLoggedUser = createAsyncThunk("auth/me",async(_,thunkApi) => {
  try {
    let res = await axiosInstance.get('/auth/me');
    console.log(res);
    return res.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
})