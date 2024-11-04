import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "./Http";

const url = process.env.REACT_APP_API + "/admitcardtemplate";

export const getAdmitCardTemplate = createAsyncThunk(
  "Template/allSchoolStatus",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const TemplateSlice = createSlice({
  name: "Template",
  initialState: {
    Templates: [],
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdmitCardTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdmitCardTemplate.fulfilled, (state, action) => {
        state.Templates = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getAdmitCardTemplate.rejected, (state, action) => {
        state.loading = false;
        state.Templates = [];
        state.error = action.payload;
      });
  },
});

export default TemplateSlice.reducer;
