import React from "react";
import PropTypes from "prop-types";
import { MdCheckCircle, MdCancel, MdClose } from "react-icons/md";
import logo from "../../assets/Logo.png";
import { formatRupiah } from "../../utils/formatter";
import { Link } from "react-router-dom";

const ModalTransaction = ({
  isOpen,
  type = "confirm",
  amount,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity'>
      <div className='bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm text-center transform transition-all scale-100'>
        <div className='flex justify-center mb-6'>
          {type === "confirm" && (
            <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center'>
              <img src={logo} alt='Logo' className='w-12 h-12' />
            </div>
          )}

          {type === "success" && (
            <div className='bg-green-500 rounded-full p-2'>
              <MdCheckCircle className='text-white w-12 h-12' />
            </div>
          )}

          {type === "failed" && (
            <div className='bg-red-500 rounded-full p-2'>
              <MdClose className='text-white w-12 h-12' />
            </div>
          )}
        </div>

        <div className='mb-8'>
          {type === "confirm" ? (
            <>
              <p className='text-gray-600 mb-2'>
                Anda yakin untuk Top Up sebesar
              </p>
              <h3 className='text-2xl font-bold text-gray-900'>
                {formatRupiah(amount)} ?
              </h3>
            </>
          ) : type === "success" ? (
            <>
              <p className='text-gray-600 mb-2'>Top Up sebesar</p>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                {formatRupiah(amount)}
              </h3>
              <p className='text-gray-600'>berhasil!</p>
            </>
          ) : (
            <>
              <p className='text-gray-600 mb-2'>Top Up sebesar</p>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                {formatRupiah(amount)}
              </h3>
              <p className='text-gray-600'>gagal</p>
            </>
          )}
        </div>

        <div className='space-y-4'>
          {type === "confirm" ? (
            <>
              <button
                onClick={onConfirm}
                className='text-red-600 font-bold hover:cursor-pointer hover:text-red-800 transition block w-full'
              >
                Ya, lanjutkan Top Up
              </button>
              <button
                onClick={onClose}
                className='text-gray-400 font-bold hover:cursor-pointer hover:text-gray-600 transition block w-full'
              >
                Batalkan
              </button>
            </>
          ) : (
            <Link
              to='/dashboard'
              onClick={onClose}
              className='text-red-600 font-bold hover:cursor-pointer hover:text-red-800 transition block w-full'
            >
              Kembali ke Beranda
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

ModalTransaction.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(["confirm", "success", "failed"]),
  amount: PropTypes.number,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

export default ModalTransaction;
