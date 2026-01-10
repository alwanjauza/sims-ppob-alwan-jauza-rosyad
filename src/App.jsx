import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import LoginPage from "./pages/Login";
import RegistrationPage from "./pages/Registration";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./pages/Dashboard";
import TopUpPage from "./pages/TopUp";
import TransactionPage from "./pages/Transaction";
import ProfilePage from "./pages/Profile";
import PaymentPage from "./pages/Payment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path='/' element={<LoginPage />} />
          <Route path='/registration' element={<RegistrationPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/topup' element={<TopUpPage />} />
            <Route path='/transaction' element={<TransactionPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/transaction/payment' element={<PaymentPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
