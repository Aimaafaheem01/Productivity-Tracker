function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium text-sm px-5 py-2.5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-ocean-500 text-white hover:bg-ocean-600 shadow-sm hover:shadow-md active:scale-[0.98]",
    secondary:
      "bg-white border border-azure-300 text-azure-600 hover:bg-azure-50 active:scale-[0.98]",
    ghost:
      "bg-transparent text-deep-700 hover:bg-mist-100 active:scale-[0.98]",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button; 