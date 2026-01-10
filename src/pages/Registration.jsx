import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdLockOutline, MdPerson } from "react-icons/md";
import { CiAt } from "react-icons/ci";
import {
  registerUser,
  resetRegistrationStatus,
  clearError,
} from "../redux/slices/authSlice";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import logo from "../assets/Logo.png";

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    first_name: z.string().min(1, "Nama depan wajib diisi"),
    last_name: z.string().min(1, "Nama belakang wajib diisi"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirm_password: z.string().min(8, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password tidak sama",
    path: ["confirm_password"],
  });

function RegistrationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, registrationSuccess } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetRegistrationStatus());
        navigate("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, navigate, dispatch]);

  const onSubmit = (data) => {
    const payload = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
    };
    dispatch(registerUser(payload));
  };

  const handleCloseAlert = () => {
    dispatch(clearError());
  };

  return (
    <>
      <div className='flex flex-col justify-center'>
        <div className='text-center mb-12'>
          <div className='flex items-center justify-center gap-2 mb-10'>
            <img src={logo} alt='Logo SIMS PPOB' className='w-8 h-8' />
            <span className='text-2xl font-bold text-gray-800'>SIMS PPOB</span>
          </div>
          <h2 className='text-3xl font-bold text-gray-900 px-4'>
            Lengkapi data untuk membuat akun
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col gap-0 md:gap-4'>
            <Input
              {...register("email")}
              type='email'
              placeholder='masukkan email anda'
              icon={CiAt}
              error={errors.email?.message}
            />

            <Input
              {...register("first_name")}
              type='text'
              placeholder='nama depan'
              icon={MdPerson}
              error={errors.first_name?.message}
            />

            <Input
              {...register("last_name")}
              type='text'
              placeholder='nama belakang'
              icon={MdPerson}
              error={errors.last_name?.message}
            />

            <Input
              {...register("password")}
              type='password'
              placeholder='buat password'
              icon={MdLockOutline}
              error={errors.password?.message}
            />

            <Input
              {...register("confirm_password")}
              type='password'
              placeholder='konfirmasi password'
              icon={MdLockOutline}
              error={errors.confirm_password?.message}
            />
          </div>

          <Button type='submit' isLoading={loading} className='mt-6'>
            Registrasi
          </Button>
        </form>

        <div className='text-center mt-6 text-sm text-gray-500'>
          sudah punya akun? login{" "}
          <Link
            to='/'
            className='text-red-500 font-bold hover:text-red-700 transition-colors'
          >
            di sini
          </Link>
        </div>
      </div>

      {(error || registrationSuccess) && (
        <div className='absolute bottom-10 left-1/2 -translate-x-1/2 w-11/12 md:w-full max-w-md px-0'>
          {error && (
            <Alert type='error' message={error} onClose={handleCloseAlert} />
          )}
          {registrationSuccess && (
            <Alert
              type='success'
              message='Registrasi berhasil! Mengalihkan ke halaman login...'
            />
          )}
        </div>
      )}
    </>
  );
}

export default RegistrationPage;
