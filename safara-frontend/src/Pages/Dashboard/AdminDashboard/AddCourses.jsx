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
              placeholder="Recipe name"
              className="input input-bordered"
            />
          </div>
          <div className="flex justify-between gap-3 ">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Category*</span>
              </label>

              <select className="select select-bordered w-full max-w-xs">
                <option disabled selected>
                  Select a category
                </option>
                <option>Web Development</option>
                <option>BBQ</option>
                <option>SHAWARMA</option>
                <option>GRILL</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price*</span>
              </label>
              <input
                type="number"
                placeholder="Price"
                className="input input-bordered"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Course Details*</span>
            </label>
            <textarea
              className="textarea  textarea-bordered h-24"
              placeholder="Recipe Details"
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
            Add item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourses;
