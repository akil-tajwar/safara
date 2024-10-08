import React, { useState, useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import certificateTemplate from "/certificate.jpg";
import useAuthContext from "../hooks/useAuthContext";

const Certicate = () => {
  const ref = useRef(null);
  const {user} = useAuthContext()
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");

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
      {/* Input fields */}
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
      />

      <input
        type="text"
        placeholder="Enter Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      {/* Certificate container */}
      <div ref={ref} className="relative h-[400px] w-[560px]">
        <img src={certificateTemplate} alt="Certificate Template" className="h-full w-full object-cover" />
        <div className="absolute inset-0">
          {/* Name and Course */}
          <h1 className="absolute top-[180px] left-[150px] text-xl font-bold">{name || user?.user.firstname+" "+user?.user.lastname}</h1>
          <p className="absolute top-[216px] left-[320px] text-lg">{course}</p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onButtonClick}
        className="mt-4 h-10 w-24 bg-orange-500 text-white rounded hover:bg-orange-600 transition duration-300"
      >
        Click me
      </button>
    </div>
  );
};

export default Certicate;
