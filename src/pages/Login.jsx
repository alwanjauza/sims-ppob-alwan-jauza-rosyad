import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";

import { clearError, loginUser } from "../redux/slices/authSlice";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import logo from "../assets/Logo.png";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    const result = await dispatch(
      loginUser({
        email: data.email,
        password: data.password,
      })
    );
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  const handleCloseAlert = () => {
    dispatch(clearError());
  };

  return (
    <>
      <div className='flex flex-col justify-center'>
        <div className='text-center mb-10'>
          <div className='flex items-center justify-center gap-2 mb-6'>
            <img src={logo} alt='Logo SIMS PPOB' className='w-8 h-8' />
            <span className='text-xl font-bold text-gray-800'>SIMS PPOB</span>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 px-10'>
            Masuk atau buat akun untuk memulai
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <Input
            {...register("email")}
            type='email'
            placeholder='masukkan email anda'
            icon={MdOutlineEmail}
            error={errors.email?.message}
          />

          <Input
            {...register("password")}
            type='password'
            placeholder='masukkan password anda'
            icon={MdLockOutline}
            error={errors.password?.message}
          />

          <Button type='submit' isLoading={loading} className='mt-8'>
            Masuk
          </Button>
        </form>

        <div className='text-center mt-8 text-sm text-gray-500'>
          belum punya akun? registrasi{" "}
          <Link
            to='/registration'
            className='text-red-500 font-bold hover:text-red-700'
          >
            di sini
          </Link>
        </div>
      </div>

      {error && (
        <div className='absolute bottom-20 left-1/2 -translate-x-1/2 w-11/12 md:w-full max-w-md px-0'>
          <Alert type='error' message={error} onClose={handleCloseAlert} />
        </div>
      )}
    </>
  );
}

export default LoginPage;
