import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_API + "/teacherauth";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/login`, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const loginSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userData : JSON.parse(localStorage.getItem("loginData")), 
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.error = null;
      state.user = null;
      localStorage.removeItem("loginData");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.error = null;
        state.user = action.payload;
        localStorage.setItem("loginData", JSON.stringify(action.payload));
        localStorage.setItem("Ttoken",action.payload?.token);
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload.response?.data?.error;
      });
  },
});

export const { logout, setUser } = loginSlice.actions;

export default loginSlice.reducer;
