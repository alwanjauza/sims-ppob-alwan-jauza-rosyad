import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/profile");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal ambil profil"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put("/profile/update", data);
      dispatch(getProfile());
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal update profil"
      );
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  "user/updateImage",
  async (file, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.put("/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(getProfile());
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal upload gambar"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfileImage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
