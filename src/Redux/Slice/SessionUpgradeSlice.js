import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "./Http";

const url = process.env.REACT_APP_API + "/class";



export const ClassSlice = createSlice({
    name: "Class",
    initialState: {
      Classs: [],
      error: null,
      loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {

    },});

    export default ClassSlice.reducer;