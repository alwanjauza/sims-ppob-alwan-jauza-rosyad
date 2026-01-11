import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineMoney } from "react-icons/md";
import { getProfile } from "../redux/slices/userSlice";
import { getBalance, topUp } from "../redux/slices/transactionSlice";
import Button from "../components/ui/Button";
import ModalTransaction from "../components/ui/ModalTransaction";
import defaultProfile from "../assets/Profile Photo.png";
import backgroundSaldo from "../assets/Background.png";
import { formatRupiah } from "../utils/formatter";

function TopUpPage() {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [modalType, setModalType] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const { profile } = useSelector((state) => state.user);
  const { balance, loading } = useSelector((state) => state.transaction);

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());
  }, [dispatch]);

  const presets = [10000, 20000, 50000, 100000, 250000, 500000];

  const handleInputChange = (e) => {
    let value = e.target.value;

    const rawValue = value.replace(/\./g, "");

    if (/^\d*$/.test(rawValue)) {
      setAmount(rawValue);
    }
  };

  const displayAmount = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value);
  };

  const handleTopUpClick = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setModalType("confirm");
    setIsOpen(true);
  };

  const handleConfirmTopUp = async () => {
    const result = await dispatch(topUp(Number(amount)));

    if (topUp.fulfilled.match(result)) {
      setModalType("success");
    } else {
      setModalType("failed");
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setModalType(null);
    if (modalType === "success") {
      setAmount("");
    }
  };

  const isButtonDisabled =
    !amount || Number(amount) > 1000000 || Number(amount) < 10000 || loading;

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
        <p className='text-lg text-gray-900 mb-1'>Silahkan masukan</p>
        <h2 className='text-2xl font-bold text-gray-900 mb-10'>
          Nominal Top Up
        </h2>

        <div className='flex flex-col md:flex-row gap-6'>
          <div className='w-full md:w-7/12 space-y-4'>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400'>
                <MdOutlineMoney size={20} />
              </span>

              <input
                type='text'
                placeholder='masukkan nominal Top Up'
                value={displayAmount(amount)}
                onChange={handleInputChange}
                className='w-full py-3 pl-10 pr-4 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500 transition'
              />
            </div>

            <Button
              onClick={handleTopUpClick}
              disabled={isButtonDisabled}
              className={`w-full py-3 ${
                isButtonDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Top Up
            </Button>
          </div>

          <div className='w-full md:w-5/12'>
            <div className='grid grid-cols-3 gap-4'>
              {presets.map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className={`py-3 border rounded text-sm font-medium transition duration-200 hover:cursor-pointer 
                                ${
                                  Number(amount) === val
                                    ? "border-red-500 text-red-500 bg-red-50"
                                    : "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-400 bg-white"
                                }
                            `}
                >
                  {formatRupiah(val).replace("Rp ", "Rp")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ModalTransaction
        isOpen={isOpen}
        type={modalType}
        amount={Number(amount)}
        onConfirm={handleConfirmTopUp}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default TopUpPage;
