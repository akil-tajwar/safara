import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosContact } from "react-icons/io";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaPhone,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      {/* Main Footer Content */}
      <div className="py-10 lg:w-3/4 w-11/12 mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Address Section */}
        <div className="flex flex-col col-span-2">
          <h6 className="text-lg font-semibold mb-6">Contact Us</h6>
          <Link
            to="/location"
            className="flex items-center text-white mb-4 hover:text-gray-300"
          >
            <FaLocationDot className="mr-3  text-xl" />
            <span>
              Office: Holding-83, DNCC, Mujibur business center, Top Floor, 100
              Feet, Madani Avenue, Vatara, Dhaka-1212 <br />
            </span>
          </Link>
          <Link
            to="/contact"
            className="flex items-center text-white mb-4 hover:text-gray-300"
          >
            <FaPhone className="mr-3 text-xl" />
            Support:+880 1558-000555 <br />
            Helpline:+880 1558-000555 <br />
            (Available: Sat-thu, 10:00AM to 7.00PM)
          </Link>
          <Link
            to="/contact"
            className="flex items-center text-white mb-4 hover:text-gray-300"
          >
            <MdEmail className="mr-3 text-xl" />
            info@university.edu
          </Link>
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col lg:ml-28">
          <h6 className="text-lg font-semibold mb-6">Quick Links</h6>
          <Link to="/admissions" className="mb-3 text-sm hover:text-gray-300">
            Enroll
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
          <Link to="/privacy" className="text-sm mb-3 hover:text-gray-300">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-sm hover:text-gray-300">
            Terms & Conditions
          </Link>
        </div>

        {/* Social Media Section */}
        <div className="flex flex-col items-end">
          <div>
            <h6 className="text-lg font-semibold mb-6">Follow Us</h6>
            <div className="flex space-x-5">
              <Link
                to="https://www.facebook.com/profile.php?id=61565767569776"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <FaFacebook className="text-3xl" />
              </Link>
              <Link
                to="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <FaTwitter className="text-3xl" />
              </Link>
              <Link
                to="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <FaLinkedin className="text-3xl" />
              </Link>
              <Link
                to="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <FaYoutube className="text-3xl" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center bg-[#144679] py-2">
        <p className="text-sm">© Safara Academy {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
