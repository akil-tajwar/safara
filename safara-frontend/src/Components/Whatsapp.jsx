import { useState } from "react";
import { Link } from "react-router-dom";

const Whatsapp = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => setIsExpanded(!isExpanded);

  return (
    <div className="fixed z-50 bottom-5 right-10">
      <div
        className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out ${
          isExpanded ? "bg-white w-64 h-72" : "w-16 h-16"
        }`}
      >
        {isExpanded ? (
          <div className="p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-green-600 font-bold">WhatsApp</h3>
              <button
                onClick={handleClick}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* QR Code + Chat Info */}
            <div className="flex flex-col items-center">
              <p className="mb-2 text-sm text-gray-600">Scan to chat with us</p>
              <div className="p-2 rounded-md mb-2">
                <div className="w-40 h-40 mb-3 flex items-center justify-center">
                  <img
                    src="/qr-code.png"
                    alt="WhatsApp QR Code"
                    className="w-full h-full object-cover border rounded-md"
                  />
                </div>
              </div>

              <span className="text-xs text-gray-500 mb-2">
                Or click to chat now
              </span>

              {/* Direct chat link */}
              <a
                href="https://wa.me/+8801558000555" // ✅ Replace with your
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <Link onClick={handleClick}>
            <img
              className="w-16 h-16 cursor-pointer hover:scale-110 transition-transform duration-200"
              src="/whatsapp-logo.png" // ✅ image must be in public folder
              alt="WhatsApp Logo"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Whatsapp;
