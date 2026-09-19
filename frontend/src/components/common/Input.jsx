// Created by: Jorge Menjivar
// Edited by: Jorge Menjivar

import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, id, error, icon, rightElement, className = "", ...props },
  ref,
) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-lg border py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${
            icon ? "pl-10" : "pl-3"
          } ${rightElement ? "pr-10" : "pr-3"} ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500"
              : "border-gray-200 focus:border-green-500 focus:ring-green-500"
          }`}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
