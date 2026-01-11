import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { getProfile } from "../redux/slices/userSlice";
import { getBalance } from "../redux/slices/transactionSlice";
import { getBanners, getServices } from "../redux/slices/informationSlice";
import defaultProfile from "../assets/Profile Photo.png";
import backgroundSaldo from "../assets/Background Saldo.png";
import { formatRupiah } from "../utils/formatter";
import ModalStatus from "../components/ui/ModalStatus";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    status: "failed",
  });

  const { profile, loading: userLoading } = useSelector((state) => state.user);
  const { balance, loading: balanceLoading } = useSelector(
    (state) => state.transaction
  );
  const {
    services,
    banners,
    loading: infoLoading,
  } = useSelector((state) => state.information);

  const isLoading = userLoading || balanceLoading || infoLoading;

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());
    dispatch(getServices());
    dispatch(getBanners());
  }, [dispatch]);

  const handleServiceClick = (service) => {
    navigate("/transaction/payment", { state: { service } });
  };

  if (isLoading) {
    return (
      <div className='space-y-10 animate-pulse'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
          <div className='w-full md:w-5/12 text-center md:text-left'>
            <div className='w-20 h-20 bg-gray-300 rounded-full mb-4 mx-auto md:mx-0'></div>
            <div className='h-4 bg-gray-300 w-32 mx-auto md:mx-0 mb-2 rounded'></div>
            <div className='h-8 bg-gray-300 w-48 mx-auto md:mx-0 rounded'></div>
          </div>
          <div className='w-full md:w-7/12'>
            <div className='bg-gray-300 rounded-2xl h-44 w-full'></div>
          </div>
        </div>

        <div className='grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4'>
          {[...Array(12)].map((_, i) => (
            <div key={i} className='flex flex-col items-center gap-2'>
              <div className='w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-lg'></div>
              <div className='h-3 bg-gray-300 w-12 rounded'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-10'>
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
            className='rounded-2xl p-6 text-white shadow-xl relative overflow-hidden bg-cover bg-center'
            style={{ backgroundImage: `url(${backgroundSaldo})` }}
          >
            <div className='relative z-10 py-2'>
              <p className='text-sm font-medium mb-4'>Saldo anda</p>

              <div className='text-3xl font-bold mb-5 tracking-wider'>
                {showBalance ? formatRupiah(balance || 0) : "Rp •••••••"}
              </div>

              <div className='flex items-center gap-2 text-sm'>
                <p>Lihat Saldo</p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className='focus:outline-none hover:text-gray-200 hover:cursor-pointer transition'
                >
                  {showBalance ? (
                    <MdVisibility size={18} />
                  ) : (
                    <MdVisibilityOff size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-y-6 gap-x-2'>
        {services.map((item) => (
          <div
            key={item.service_code}
            className='flex flex-col items-center gap-2 cursor-pointer group hover:scale-105 transition-transform duration-200'
            onClick={() => handleServiceClick(item)}
          >
            <img
              src={item.service_icon}
              alt={item.service_name}
              className='w-12 h-12 md:w-16 md:h-16 object-contain'
            />

            <span className='text-[10px] sm:text-xs text-center font-medium text-gray-700 w-full leading-tight px-1'>
              {item.service_name}
            </span>
          </div>
        ))}
      </div>

      <div>
        <h3 className='text-lg font-bold text-gray-900 mb-6'>
          Temukan promo menarik
        </h3>
        <div className='flex gap-6 overflow-x-auto pb-4 scrollbar-hide'>
          {banners.map((item) => (
            <div key={item.banner_name} className='shrink-0 relative'>
              <img
                src={item.banner_image}
                alt={item.banner_name}
                className='h-32 sm:h-36 w-auto rounded-xl object-cover shadow-sm transition-transform hover:scale-[1.02]'
              />
            </div>
          ))}
        </div>
      </div>
      <ModalStatus
        isOpen={modal.isOpen}
        status='failed'
        message={modal.message}
        buttonText='Tutup'
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  );
};

export default Dashboard;
