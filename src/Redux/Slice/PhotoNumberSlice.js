import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "./Http";

const url = process.env.REACT_APP_API + "/photonumber";


export const getPhotoNumberBySchoolId = createAsyncThunk(
  "PhotoNumber/getPhotoNumber",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/${id}`);
         
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePhotoNumber = createAsyncThunk(
  "PhotoNumber/updatePhotoNumber",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${url}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const SectionSlice = createSlice({
  name: "PhotoNumber",
  initialState: {
    PhotoNumber: null,
    Numbers:null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPhotoNumberBySchoolId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhotoNumberBySchoolId.fulfilled, (state, action) => {
        state.Numbers = action.payload?.prefix + (Number(action.payload?.number) + Number(1));
        state.PhotoNumber = action.payload
        state.error = null;
        state.loading = false;
      })
      .addCase(getPhotoNumberBySchoolId.rejected, (state, action) => {
        state.loading = false;
        state.PhotoNumber = [];
        state.error = action.payload;
      })
      .addCase(updatePhotoNumber.pending, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePhotoNumber.fulfilled, (state, action) => {
        state.error = null;
        const index = state.PhotoNumber.findIndex(
          (PhotoNumber) => PhotoNumber._id === action.payload._id
        );
        if (index !== -1) {
          state.PhotoNumber[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updatePhotoNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default SectionSlice.reducer;
