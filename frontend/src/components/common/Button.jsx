// Created by: Jorge Menjivar
// Edited by: Jorge Menjivar

const VARIANT_CLASSES = {
  primary:
    "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300",
  outline:
    "border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:text-gray-300",
};

const Button = ({
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
