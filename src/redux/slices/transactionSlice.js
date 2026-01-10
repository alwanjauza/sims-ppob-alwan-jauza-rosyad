import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const getBalance = createAsyncThunk(
  "transaction/getBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/balance");
      return response.data.data.balance;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal ambil saldo"
      );
    }
  }
);

export const topUp = createAsyncThunk(
  "transaction/topUp",
  async (amount, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/topup", { top_up_amount: amount });

      dispatch(getBalance());

      return response.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Top Up Gagal");
    }
  }
);

export const doTransaction = createAsyncThunk(
  "transaction/pay",
  async (serviceCode, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/transaction", {
        service_code: serviceCode,
      });

      dispatch(getBalance());

      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Transaksi Gagal");
    }
  }
);

export const getHistory = createAsyncThunk(
  "transaction/getHistory",
  async ({ offset = 0, limit = 5 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/transaction/history?offset=${offset}&limit=${limit}`
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal ambil history"
      );
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    balance: 0,
    history: [],
    loading: false,
    error: null,
    hasMore: true,
  },
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
    clearHistory: (state) => {
      state.history = [];
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
      })
      .addCase(topUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(topUp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(topUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(doTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doTransaction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(doTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.loading = false;
        const newRecords = action.payload.records;

        if (action.meta.arg.offset === 0) {
          state.history = newRecords;
        } else {
          state.history = [...state.history, ...newRecords];
        }

        if (newRecords.length < action.meta.arg.limit) {
          state.hasMore = false;
        }
      })
      .addCase(getHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTransactionError, clearHistory } = transactionSlice.actions;
export default transactionSlice.reducer;
