import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const Step2_Address = () => {
  const { companyData, setCompanyData } = useOutletContext();
  const navigate = useNavigate();

  // Guard: Redirect if the user hasn't completed the previous step.
  useEffect(() => {
    if (!companyData.name) {
      navigate("/create-company");
    }
  }, [companyData.name, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Simple validation
    if (
      companyData.address &&
      companyData.city &&
      companyData.state &&
      companyData.zip
    ) {
      navigate("/create-company/subscription");
    } else {
      // You could add a more user-friendly error message here
      alert("Please fill out all address fields.");
    }
  };

  return (
    <form onSubmit={handleNext}>
      <h2 className="card-title mb-4">Where is your company located?</h2>
      <div className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Street Address</span>
          </label>
          <input
            type="text"
            name="address"
            placeholder="123 Main St"
            className="input input-bordered w-full"
            value={companyData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">City</span>
            </label>
            <input
              type="text"
              name="city"
              placeholder="Anytown"
              className="input input-bordered w-full"
              value={companyData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">State / Province</span>
            </label>
            <input
              type="text"
              name="state"
              placeholder="CA"
              className="input input-bordered w-full"
              value={companyData.state}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">ZIP / Postal Code</span>
            </label>
            <input
              type="text"
              name="zip"
              placeholder="90210"
              className="input input-bordered w-full"
              value={companyData.zip}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>
      <div className="card-actions justify-between mt-6">
        <button
          type="button"
          onClick={() => navigate("/create-company")}
          className="btn btn-ghost"
        >
          Back
        </button>
        <button type="submit" className="btn btn-primary">
          Next
        </button>
      </div>
    </form>
  );
};

export default Step2_Address;
