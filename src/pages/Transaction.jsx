import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../redux/slices/userSlice";
import { getBalance, getHistory } from "../redux/slices/transactionSlice";
import defaultProfile from "../assets/Profile Photo.png";
import backgroundSaldo from "../assets/Background.png";
import { formatRupiah, formatDate } from "../utils/formatter";

function TransactionPage() {
  const dispatch = useDispatch();

  const limit = 5;

  const { profile } = useSelector((state) => state.user);
  const { balance, history, loading, hasMore } = useSelector(
    (state) => state.transaction
  );

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());

    dispatch(getHistory({ offset: 0, limit }));
  }, [dispatch]);

  const handleShowMore = () => {
    const currentOffset = history.length;
    dispatch(getHistory({ offset: currentOffset, limit }));
  };

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
        <h2 className='text-lg font-bold text-gray-900 mb-6'>
          Semua Transaksi
        </h2>

        <div className='space-y-4'>
          {history.length > 0 ? (
            history.map((item, index) => (
              <div
                key={index}
                className='bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-start hover:shadow-sm transition'
              >
                <div className='flex flex-col gap-1'>
                  <span
                    className={`text-lg font-bold ${
                      item.transaction_type === "TOPUP"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {item.transaction_type === "TOPUP" ? "+ " : "- "}
                    {formatRupiah(item.total_amount)}
                  </span>

                  <span className='text-xs text-gray-400'>
                    {formatDate(item.created_on)}
                  </span>
                </div>

                <div className='text-right'>
                  <span className='text-xs font-medium text-gray-700'>
                    {item.description}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-12'>
              <p className='text-gray-400 text-sm'>
                Maaf tidak ada histori transaksi saat ini
              </p>
            </div>
          )}
        </div>

        {hasMore && history.length > 0 && (
          <div className='text-center mt-8'>
            <button
              onClick={handleShowMore}
              disabled={loading}
              className='text-red-500 font-bold text-sm hover:cursor-pointer hover:text-red-700 disabled:opacity-50 transition'
            >
              {loading ? "Loading..." : "Show more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionPage;
