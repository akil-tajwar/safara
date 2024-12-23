import { useState, useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
import certificateTemplate from "/certificate.jpg";
import useAuthContext from "../hooks/useAuthContext";

const Certificate = () => {
  const ref = useRef(null);
  const { user } = useAuthContext();
  const location = useLocation(); // Access state
  const navigate = useNavigate(); // Redirect if necessary
  const { courseTitle } = location.state || {}; // Safely access courseTitle

  // Redirect if state is missing
  if (!courseTitle) {
    navigate("/dashboard/user", { replace: true });
    return null;
  }

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "certificate.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  return (
    <div className="flex flex-col items-center">
      {/* Certificate container */}
      <div ref={ref} className="relative h-[400px] w-[560px]">
        <img
          src={certificateTemplate}
          alt="Certificate Template"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0">
          <h1 className="absolute top-[180px] left-[150px] text-xl font-bold">
            {user?.user.firstname} {user?.user.lastname}
          </h1>
          <p className="absolute top-[216px] left-[320px] text-lg">
            {courseTitle}
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onButtonClick}
        className="mt-4 h-10 w-24 bg-orange-500 text-white rounded hover:bg-orange-600 transition duration-300"
      >
        Download
      </button>
    </div>
  );
};

export default Certificate;
