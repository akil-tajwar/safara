const AddCourses = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2 className="text-5xl font-bold text-[]">Add a Course</h2>
      <div className="divider"></div>
      <div>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Course Name*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Course name"
              className="input input-bordered rounded-none"
            />
          </div>
          <div className="flex justify-between gap-3 ">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Category*</span>
              </label>

              <select className="select select-bordered rounded-none w-full max-w-xs">
                <option disabled selected>
                  Select a category
                </option>
                <option>Web Development</option>
                <option>C++</option>
                <option>Python</option>
                <option>Sharpe</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price*</span>
              </label>
              <input
                type="number"
                placeholder="Price"
                className="input input-bordered rounded-none"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Course Details*</span>
            </label>
            <textarea
              className="textarea  textarea-bordered rounded-none h-24"
              placeholder="Course Details"
            ></textarea>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text"></span>
            </label>
            <input type="file" />
          </div>

          <button
            type="submit"
            className="btn bg-[#125ca6] text-white text-3xl "
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourses;
