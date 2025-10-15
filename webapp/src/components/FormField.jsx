const FormField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  disabled,
  children,
}) => {
  // Conditionally apply classes for the red outline if an error exists
  const inputClasses = `input input-bordered w-full text-base ${
    error ? "input-error" : "input-neutral"
  } ${Icon ? "pl-10" : ""}`;

  return (
    <div className="mb-2">
      <label className="block text-base mb-1" htmlFor={id}>
        {label}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-0 pl-3 flex items-center pointer-events-none z-10">
            <Icon className="h-5 w-5 text-base-content/50" />
          </div>
        )}
        <input
          className={inputClasses}
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          disabled={disabled}
        />
      </div>
      {/* Display the error message if it exists */}
      {error && <p className="text-error text-xs mt-1">{error}</p>}
      {/* Render any children passed to the component */}
      {children}
    </div>
  );
};

export default FormField;
