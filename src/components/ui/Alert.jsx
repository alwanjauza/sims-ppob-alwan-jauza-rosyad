import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { cn } from "../../utils/cn";
import { MdClose } from "react-icons/md";

const Alert = ({
  type = "error",
  message,
  onClose,
  duration = 3000,
  className,
}) => {
  useEffect(() => {
    if (message && onClose && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded text-sm font-medium transition-all duration-300 shadow-md",
        type === "error"
          ? "bg-red-100 text-red-600 border border-red-200"
          : "bg-green-100 text-green-600 border border-green-200",
        className
      )}
    >
      <span className='flex-1 mr-2'>{message}</span>

      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            "p-1 rounded-full hover:bg-black/5 hover:cursor-pointer transition-colors focus:outline-none",
            type === "error"
              ? "text-red-400 hover:text-red-600"
              : "text-green-400 hover:text-green-600"
          )}
        >
          <MdClose size={18} />
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(["error", "success"]),
  message: PropTypes.string,
  onClose: PropTypes.func,
  duration: PropTypes.number,
  className: PropTypes.string,
};

export default Alert;
