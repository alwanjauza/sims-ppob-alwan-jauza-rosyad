import React from "react";
import { Outlet } from "react-router-dom";
import illustrationLogin from "../../assets/Illustrasi Login.png";

const AuthLayout = () => {
  return (
    <div className='flex min-h-screen w-full bg-white'>
      <div className='relative w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12'>
        <div className='w-full max-w-md z-10'>
          <Outlet />
        </div>
      </div>

      <div className='hidden lg:flex w-1/2 bg-red-50 items-center justify-center relative'>
        <img
          src={illustrationLogin}
          alt='Illustration'
          className='object-contain w-full h-full max-h-screen'
        />
      </div>
    </div>
  );
};

export default AuthLayout;
