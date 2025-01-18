import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosContact } from "react-icons/io";
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#125ca6] text-white">
      {/* Main Footer Content */}
      <div className="py-10 lg:w-3/4 w-11/12 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Address Section */}
        <div className="flex flex-col">
          <h6 className="text-lg font-semibold mb-6">Contact Us</h6>
          <Link
            to="/location"
            className="flex items-center text-white mb-4 hover:text-gray-300"
          >
            <FaLocationDot className="mr-3 mb-28  text-4xl" />
            <span>
              Office: Holding-83, DNCC, Mujibur business center, Top Floor, 100
              Feet, Madani Avenue, Vatara, Dhaka-1212 <br />
              Support:+880 1558-000555 <br />
              Helpline:+880 1558-000555 <br />
              (Available: Sat-thu, 10:00AM to 7.00PM)
            </span>
          </Link>
          <Link
            to="/contact"
            className="flex items-center text-white mb-4 hover:text-gray-300"
          >
            <IoIosContact className="mr-3 text-2xl" />
            info@university.edu
          </Link>
          <p className="mt-2 text-sm">Phone: +880 1558-000555</p>
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col">
          <h6 className="text-lg font-semibold mb-6">Quick Links</h6>
          <Link to="/admissions" className="mb-3 text-sm hover:text-gray-300">
            Admissions
          </Link>
          <Link
            to="/academic-programs"
            className="mb-3 text-sm hover:text-gray-300"
          >
            Academic Programs
          </Link>
          <Link to="/research" className="mb-3 text-sm hover:text-gray-300">
            Research
          </Link>
          <Link to="/campus-life" className="text-sm hover:text-gray-300">
            Campus Life
          </Link>
        </div>

        {/* Social Media Section */}
        <div className="flex flex-col">
          <h6 className="text-lg font-semibold mb-6">Follow Us</h6>
          <div className="flex space-x-5">
            <a
              href="https://www.facebook.com/profile.php?id=61565767569776"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
              <FaFacebook className="text-3xl" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
              <FaTwitter className="text-3xl" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
              <FaLinkedin className="text-3xl" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
              <FaYoutube className="text-3xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center py-4 border-t border-gray-700">
        <p className="text-sm">
          © {new Date().getFullYear()} © Safara Academy 2025
        </p>
        <div className="mt-2 text-sm space-x-2">
          <Link to="/terms" className="hover:text-gray-300">
            Terms & Conditions
          </Link>
          <span>|</span>
          <Link to="/privacy" className="hover:text-gray-300">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
