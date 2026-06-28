function Input({ label, error, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-deep-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 rounded-xl border bg-white text-deep-800 placeholder:text-deep-700/40
          ${error ? "border-coral-400 focus:ring-coral-300" : "border-mist-200 focus:ring-ocean-300"}
          focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-150
          ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-coral-600">{error}</p>}
    </div>
  );
}

export default Input;