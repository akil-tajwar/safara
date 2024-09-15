import { useEffect, useRef, useState } from "react";
import JoditEditor from 'jodit-react';
import { RxCross2 } from "react-icons/rx";

const AddCourses = () => {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectInstructors, setSelectInstructors] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setDropdownVisible(value.length > 0);
  };

  const handleSuggestionClick = (instructor) => {
    setSearchTerm(instructor.name);
    setDropdownVisible(false);
  };

  const fetchAllUsers = () => {
    const url = `http://localhost:4000/api/user/allUsers`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSelectInstructors(data);
        console.log("🚀 ~ .then ~ data:", data); {/*i can see the datas in console*/}
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Course Title</span>
          </label>
          <input type="text" name="courseTitle" placeholder="Course Title" className="px-3 py-[11px] rounded-md border border-slate-200" />
        </div>
        <div className="flex justify-between gap-3 ">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select className="px-3 py-[11px] rounded-md cursor-pointer border border-slate-200">
              <option disabled selected>Select a category</option>
              <option>Web Development</option>
              <option>C++</option>
              <option>Python</option>
              <option>Sharpe</option>
            </select>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Sub category</span>
            </label>
            <select className="px-3 py-[11px] rounded-md cursor-pointer border border-slate-200">
              <option disabled selected>Select a category</option>
              <option>Web Development</option>
              <option>C++</option>
              <option>Python</option>
              <option>Sharpe</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between gap-3 ">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Price</span>
            </label>
            <input type="number" placeholder="Price" className="px-3 py-[11px] rounded-md border border-slate-200" />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Discount</span>
            </label>
            <input type="number" placeholder="Discount" className="px-3 py-[11px] rounded-md border border-slate-200" />
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Course Details*</span>
          </label>
          <div className="custom-class no-tailwind custom-ul custom-ol">
            <JoditEditor ref={editor} value={content} onChange={newContent => setContent(newContent)} />
          </div>
        </div>
        <div className="flex justify-between gap-3">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Banner</span>
            </label>
            <input type="file" accept="image/*" className="file-input w-full file-input-bordered" />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Syllabus</span>
            </label>
            <input type="file" accept="pdf/*" className="file-input w-full file-input-bordered" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid grid-cols-4 gap-3">
            <div className="form-control col-span-3 w-full">
              <label className="label">
                <span className="label-text">Videos</span>
              </label>
              <input type="file" accept="video/*" className="file-input w-full file-input-bordered" />
            </div>
            <p className="border h-fit text-center rounded-md py-[11px] cursor-pointer bg-slate-200 mt-9">Add Video</p>
            <div className="border mt-3 h-44 col-span-4 overflow-y-scroll rounded-md p-3">
              <p className="text-center pb-3">Your selected videos</p>
              <div className="flex justify-between items-center gap-5 bg-slate-200 p-2 rounded-md mb-2">
                <div className="flex gap-3">
                  <p>1.</p>
                  <p>Name of 1st selected video</p> {/*first 5 words will appear only. (use slice)*/}
                </div>
                <RxCross2 className="text-red-600 cursor-pointer" />
              </div>
              <div className="flex justify-between items-center gap-5 bg-slate-200 p-2 rounded-md mb-2">
                <div className="flex gap-3">
                  <p>2.</p>
                  <p>Name of 2nd selected video</p> {/*first 5 words will appear only. (use slice)*/}
                </div>
                <RxCross2 className="text-red-600 cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Instructors</span>
            </label>
            <input type="text" value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => {
                setDropdownVisible(searchTerm.length > 0);
              }}
              onBlur={() => {
                setTimeout(() => setDropdownVisible(false), 100);
              }} placeholder="Instructors" className="px-3 py-[11px] rounded-md border border-slate-200" />
            {dropdownVisible && (
              <ul className="absolute top-full left-0 w-[450px] bg-white text-black border border-gray-200 mt-1 z-10 rounded-md">
                {selectInstructors
                  .filter((instructor) =>
                    instructor?.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((instructor) => (
                    <li
                      key={instructor._id} // Ensure the key is unique
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      onMouseDown={() => handleSuggestionClick(instructor)} // Pass the instructor object
                    >
                      <div className="flex gap-3 items-center">
                        <div className="avatar">
                          <div className="w-10 h-10 border rounded-md object-cover">
                            <img src='' />
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-xl pb-2">name</h5>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
            <div className="border mt-6 h-44 col-span-4 overflow-y-scroll rounded-md p-3">
              <p className="text-center pb-3">Your selected instructors</p>
              <div className="flex justify-between items-center gap-5 bg-slate-200 p-2 rounded-md mb-2">
                <div className="flex gap-3">
                  <p>1.</p>
                  <p>Instructor Name</p>
                </div>
                <RxCross2 className="text-red-600 cursor-pointer" />
              </div>
              <div className="flex justify-between items-center gap-5 bg-slate-200 p-2 rounded-md mb-2">
                <div className="flex gap-3">
                  <p>2.</p>
                  <p>Instructor Name</p>
                </div>
                <RxCross2 className="text-red-600 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid grid-cols-4 gap-3">
            <div className="form-control col-span-3 w-full">
              <label className="label">
                <span className="label-text">Keywords</span>
              </label>
              <input type="number" placeholder="Price" className="px-3 py-[11px] rounded-md border border-slate-200" />
            </div>
            <p className="border h-fit text-center rounded-md py-[11px] cursor-pointer bg-slate-200 mt-9">Add Keyword</p>
            <div className="border mt-3 h-44 col-span-4 overflow-y-scroll rounded-md p-3">
              <p className="text-center pb-3">Your selected keywords</p>
              <div className="flex gap-3 flex-wrap">
                <div className="flex gap-5 w-fit items-center bg-slate-200 p-2 rounded-md mb-2">
                  <p>Engineering</p>
                  <RxCross2 className="text-red-600 cursor-pointer" />
                </div>
                <div className="flex gap-5 w-fit items-center bg-slate-200 p-2 rounded-md mb-2">
                  <p>Computer Science</p>
                  <RxCross2 className="text-red-600 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Requirements</span>
            </label>
            <input type="number" placeholder="Requirements" className="px-3 py-[11px] rounded-md border border-slate-200" />
          </div>
        </div>
        <div className="pt-8 text-center">
          <button type="submit" className="rounded-md py-[11px] px-4 bg-[#125ca6] text-white"> Add Course</button>
        </div>
      </form>
    </div>
  );
};

export default AddCourses;
