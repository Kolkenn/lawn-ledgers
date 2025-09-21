import { useNavigate, useOutletContext } from "react-router-dom";

const Step1_Name = () => {
  const { companyData, setCompanyData } = useOutletContext();
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (companyData.name.trim()) {
      navigate("/create-company/address");
    }
  };

  return (
    <form onSubmit={handleNext}>
      <h2 className="card-title mb-4">What is your company's name?</h2>
      <div className="form-control">
        <input
          type="text"
          placeholder="e.g., Lawn & Order"
          className="input input-bordered w-full"
          value={companyData.name}
          onChange={(e) =>
            setCompanyData({ ...companyData, name: e.target.value })
          }
          required
        />
      </div>
      <div className="card-actions justify-end mt-6">
        <button type="submit" className="btn btn-primary">
          Next
        </button>
      </div>
    </form>
  );
};

export default Step1_Name;
