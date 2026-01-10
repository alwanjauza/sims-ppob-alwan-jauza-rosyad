import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const getBanners = createAsyncThunk(
  "information/getBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/banner");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal ambil banner"
      );
    }
  }
);

export const getServices = createAsyncThunk(
  "information/getServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/services");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal ambil layanan"
      );
    }
  }
);

const informationSlice = createSlice({
  name: "information",
  initialState: {
    banners: [],
    services: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBanners.fulfilled, (state, action) => {
        state.banners = action.payload;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.services = action.payload;
      });
  },
});

export default informationSlice.reducer;
