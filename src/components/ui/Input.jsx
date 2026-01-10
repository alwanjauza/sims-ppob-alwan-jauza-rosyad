import React, { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { cn } from "../../utils/cn";

const Input = forwardRef(
  (
    { icon: Icon, type = "text", error, className, placeholder, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    const handleChange = (e) => {
      setHasValue(e.target.value.length > 0);

      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className='w-full mb-4'>
        <div className='relative'>
          {Icon && (
            <div
              className={cn(
                "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200",
                hasValue ? "text-black" : "text-gray-400",
                error ? "text-red-500" : ""
              )}
            >
              <Icon size={18} />
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full border rounded px-3 py-3 text-sm placeholder-gray-400 transition-colors",
              "focus:outline-none focus:ring-1",
              Icon ? "pl-10" : "pl-3",
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-red-500 focus:ring-red-500",
              className
            )}
            placeholder={placeholder}
            {...props}
            onChange={handleChange}
          />

          {type === "password" && (
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none'
            >
              {showPassword ? (
                <MdVisibility size={18} />
              ) : (
                <MdVisibilityOff size={18} />
              )}
            </button>
          )}
        </div>

        {error && (
          <span className='text-xs text-red-500 mt-1 block text-right font-medium'>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  icon: PropTypes.elementType,
  type: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default Input;
