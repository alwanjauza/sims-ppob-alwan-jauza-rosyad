import React from "react";
import PropTypes from "prop-types";
import { cn } from "../../utils/cn";

const Button = ({
  children,
  isLoading,
  className,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        "w-full bg-red-500 text-white font-semibold py-3 px-4 rounded transition-colors duration-200",
        "hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1",
        "disabled:bg-gray-400 disabled:cursor-not-allowed",
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default Button;
