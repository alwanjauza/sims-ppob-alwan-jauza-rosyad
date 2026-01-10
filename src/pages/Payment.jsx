import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineMoney } from "react-icons/md";

import { getProfile } from "../redux/slices/userSlice";
import { getBalance, doTransaction } from "../redux/slices/transactionSlice";

import Button from "../components/ui/Button";
import ModalStatus from "../components/ui/ModalStatus";
import defaultProfile from "../assets/Profile Photo.png";
import backgroundSaldo from "../assets/Background Saldo.png";
import { formatRupiah } from "../utils/formatter";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const service = location.state?.service;

  const { profile } = useSelector((state) => state.user);
  const { balance, loading } = useSelector((state) => state.transaction);

  const [modal, setModal] = useState({
    isOpen: false,
    status: "success",
    message: "",
    amount: 0,
  });

  useEffect(() => {
    if (!service) {
      navigate("/dashboard");
    }
  }, [service, navigate]);

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());
  }, [dispatch]);

  const handlePayment = async () => {
    if (!service) return;

    const result = await dispatch(doTransaction(service.service_code));

    if (doTransaction.fulfilled.match(result)) {
      setModal({
        isOpen: true,
        status: "success",
        message: `Pembayaran ${service.service_name} sebesar`,
        amount: service.service_tariff,
      });
    } else {
      setModal({
        isOpen: true,
        status: "failed",
        message: `Layanan ${service.service_name} sebesar`,
        amount: service.service_tariff,
      });
    }
  };

  if (!service) return null;

  return (
    <div className='space-y-8'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
        <div className='w-full md:w-5/12 text-center md:text-left'>
          <img
            src={
              profile?.profile_image &&
              profile?.profile_image !== "https://null"
                ? profile.profile_image
                : defaultProfile
            }
            alt='Profile'
            className='w-20 h-20 rounded-full mb-4 mx-auto md:mx-0 object-cover border border-gray-200'
            onError={(e) => {
              e.target.src = defaultProfile;
            }}
          />
          <p className='text-lg text-gray-500'>Selamat datang,</p>
          <h1 className='text-3xl font-bold text-gray-900 mt-1 capitalize'>
            {profile?.first_name} {profile?.last_name}
          </h1>
        </div>
        <div className='w-full md:w-7/12'>
          <div
            className='rounded-2xl p-6 text-white shadow-xl relative overflow-hidden bg-cover bg-center h-44 flex flex-col justify-center'
            style={{ backgroundImage: `url(${backgroundSaldo})` }}
          >
            <div className='relative z-10'>
              <p className='text-sm font-medium mb-2'>Saldo anda</p>
              <div className='text-3xl font-bold tracking-wider'>
                {formatRupiah(balance || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className='text-lg text-gray-900 mb-1'>PemBayaran</p>

        <div className='flex items-center gap-3 mb-10'>
          <img
            src={service.service_icon}
            alt={service.service_name}
            className='w-8 h-8 md:w-10 md:h-10 object-contain'
          />
          <h2 className='text-xl font-bold text-gray-900'>
            {service.service_name}
          </h2>
        </div>

        <div className='space-y-4'>
          <div className='relative w-full'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400'>
              <MdOutlineMoney size={20} />
            </span>
            <input
              type='text'
              readOnly
              value={new Intl.NumberFormat("id-ID").format(
                service.service_tariff
              )}
              className='w-full py-3 pl-10 pr-4 border border-gray-300 rounded focus:outline-none bg-white text-gray-900 font-medium'
            />
          </div>

          <Button
            onClick={handlePayment}
            isLoading={loading}
            className='w-full py-3 bg-red-500 hover:bg-red-600'
          >
            Bayar
          </Button>
        </div>
      </div>

      <ModalStatus
        isOpen={modal.isOpen}
        status={modal.status}
        message={modal.message}
        amount={modal.amount}
        buttonLink='/dashboard'
        buttonText='Kembali ke Beranda'
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  );
};

export default PaymentPage;
