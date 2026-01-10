import React from "react";
import PropTypes from "prop-types";
import { MdCheckCircle, MdClose } from "react-icons/md";
import { formatRupiah } from "../../utils/formatter";
import { Link } from "react-router-dom";

const ModalStatus = ({
  isOpen,
  status,
  amount,
  message,
  onClose,
  buttonLink = null,
  buttonText = "Kembali ke Beranda",
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity'>
      <div className='bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm text-center animate-fade-in-up'>
        <div className='flex justify-center mb-6'>
          {status === "success" ? (
            <div className='bg-green-500 rounded-full p-2'>
              <MdCheckCircle className='text-white w-12 h-12' />
            </div>
          ) : (
            <div className='bg-red-500 rounded-full p-2'>
              <MdClose className='text-white w-12 h-12' />
            </div>
          )}
        </div>

        <div className='mb-8'>
          <p className='text-gray-600 mb-2'>{message}</p>

          {amount !== undefined && amount !== null && (
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>
              {formatRupiah(amount)}
            </h3>
          )}

          <p className='text-gray-600'>
            {status === "success" ? "berhasil!" : "gagal"}
          </p>
        </div>

        <div>
          <Link
            to={buttonLink}
            onClick={onClose}
            className='text-red-600 font-bold hover:cursor-pointer hover:text-red-800 transition block w-full'
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

ModalStatus.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(["success", "failed"]).isRequired,
  amount: PropTypes.number,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  buttonLink: PropTypes.string,
  buttonText: PropTypes.string,
};

export default ModalStatus;
