import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosContact } from "react-icons/io";
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#125ca6] text-white">
      {/* Main Footer Content */}
      <div className="py-10 lg:w-3/4 w-11/12 mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Address Section */}
        <div className="flex flex-col">
          <h6 className="text-lg font-semibold mb-4">Contact Us</h6>
          <Link
            to="/location"
            className="link link-hover inline-flex items-center mb-2"
          >
            <FaLocationDot className="mr-2" />
            123 Academic Street, City, Country
          </Link>
          <Link
            to="/contact"
            className="link link-hover inline-flex items-center mb-2"
          >
            <IoIosContact className="mr-2" />
            info@university.edu
          </Link>
          <p className="mt-2">Phone: +1 (555) 123-4567</p>
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col">
          <h6 className="text-lg font-semibold mb-4">Quick Links</h6>
          <Link to="/admissions" className="link link-hover mb-2">
            Admissions
          </Link>
          <Link to="/academic-programs" className="link link-hover mb-2">
            Academic Programs
          </Link>
          <Link to="/research" className="link link-hover mb-2">
            Research
          </Link>
          <Link to="/campus-life" className="link link-hover">
            Campus Life
          </Link>
        </div>

        {/* Social Media Section */}
        <div className="flex flex-col">
          <h6 className="text-lg font-semibold mb-4">Follow Us</h6>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200"
            >
              <FaYoutube size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center py-4 border-t border-gray-700">
        <p>
          © {new Date().getFullYear()} International Academic Institute. All
          Rights Reserved.
        </p>
        <Link to="/terms" className="link link-hover inline-block mt-2">
          Terms & Conditions
        </Link>
        <span className="mx-2">|</span>
        <Link to="/privacy" className="link link-hover">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
