const FormField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
}) => {
  // Conditionally apply classes for the red outline if an error exists
  const inputClasses = `w-full px-3 py-2 border rounded-md text-base ${
    error ? "border-error" : "border-neutral"
  }`;

  return (
    <div className="mb-2">
      <label className="block text-base mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        className={inputClasses}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      {/* Display the error message if it exists */}
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
