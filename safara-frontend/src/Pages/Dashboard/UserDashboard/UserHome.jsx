const UserHome = () => {
  return (
    <div>
      <p className="md:text-4xl font-bold text-[#125ca6]">My Profile</p>
      <div className="divider"></div>

      <form className="card-body">
        <div className="md:flex justify-around ">
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              placeholder="First Name"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
            />
          </div>
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              placeholder="Last Name"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
            />
          </div>
        </div>

        <div className="md:flex justify-around ">
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
            />
          </div>
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="text"
              placeholder="Phone"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
            />
          </div>
        </div>
        <div className="md:flex justify-around w-full">
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <input
              type="text"
              placeholder="role"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
            />
          </div>
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="********"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
            />
          </div>
        </div>

        <div className="form-control mt-6 md:mx-[70px]">
          <button className="btn bg-blue-700 text-3xl text-white">Update</button>
        </div>
      </form>
    </div>
  );
};

export default UserHome;
