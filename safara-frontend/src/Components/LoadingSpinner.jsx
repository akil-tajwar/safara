// src/components/LoadingSpinner.jsx
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <span className="loading loading-spinner w-40 h-40 text-white"></span>
  </div>
);
export default LoadingSpinner;
