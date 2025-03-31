import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "./Http";

const url = process.env.REACT_APP_API + "/attendance";

export const getAttendance = createAsyncThunk(
  "Attendance/AllAttendance",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/${data?.id}/${data?.month}/${data?.year}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const saveAttendance = createAsyncThunk(
    "Attendance/saveAttendance",
    async (id, { rejectWithValue }) => {
      try {
        const res = await axios.post(`${url}/${id}`);
        return res.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

export const TemplateSlice = createSlice({
    name: "Attendance",
    initialState: {
      attendanceData: [],
      loading: false,
      error: null,
      successMessage: null,
    },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendance.fulfilled, (state, action) => {
        state.Templates = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getAttendance.rejected, (state, action) => {
        state.loading = false;
        state.Templates = [];
        state.error = action.payload;
      });
  },
});

export default TemplateSlice.reducer;
