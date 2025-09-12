import { LogOut, Building } from 'lucide-react';
import { handleLogout } from '../firebase/authService';

const CompanySelectionPage = ({ memberships, onSelectCompany }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Select a Company</h1>
        <div className="space-y-4">
          {memberships.map((mem) => (
            <button
              key={mem.companyId}
              onClick={() => onSelectCompany(mem.companyId)}
              className="w-full flex items-center text-left p-4 bg-gray-50 rounded-lg hover:bg-green-100 hover:border-green-300 border border-transparent transition-colors"
            >
              <Building className="w-6 h-6 mr-4 text-gray-500" />
              <div>
                <p className="font-bold text-gray-900">{mem.companyName}</p>
                <p className="text-sm text-gray-500 capitalize">{mem.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <button onClick={handleLogout} className="flex items-center mt-8 text-sm text-gray-600 hover:text-red-600">
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </button>
    </div>
  );
};

export default CompanySelectionPage;