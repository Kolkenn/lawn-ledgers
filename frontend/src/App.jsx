// A simple SVG icon for the phone
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

// This is our main App component
function App() {
  return (
    // Main container to center the content on the page
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">

      {/* The Client Card */}
      <div className="max-w-md md:max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">John Doe</h1>
            <p className="text-sm font-medium text-gray-500">123 Maple Street, Anytown</p>
          </div>
          <div className="text-xs font-semibold text-white bg-orange-500 rounded-full px-3 py-1">
            Pending
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Contact Info Section */}
        <div className="flex items-center space-x-3 text-gray-600">
          <PhoneIcon />
          <span>(555) 123-4567</span>
        </div>

        {/* Notes Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">Service Notes</h3>
          <p className="mt-2 text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
            Gate code is #1234. Please be mindful of the dog, Sparky. He's friendly but likes to escape. Mow front and back, trim hedges on the west side of the property.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors cursor-pointer">
            View Job Details
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;