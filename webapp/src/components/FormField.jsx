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
  const inputClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
    error ? "border-red-500 ring-red-500" : "border-gray-300"
  }`;

  return (
    <div className="mb-2">
      <label className="block text-gray-700 font-bold mb-1" htmlFor={id}>
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
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
