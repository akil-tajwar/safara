
const Settings = () => {
    return (
        <div className="card bg-base-100 w-full max-w-md mx-auto shrink-0 shadow-2xl">
        <form className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Old Password</span>
            </label>
            <input type="password" placeholder="Old Password" className="input input-bordered" required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <input type="password" placeholder="New Password" className="input input-bordered" required />
           
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Re-Enter New Password</span>
            </label>
            <input type="password" placeholder="Re-Enter New Password" className="input input-bordered" required />
            
          </div>
          <div className="form-control mt-6">
            <button className="btn bg-[#125ca6] text-white font-semibold">Change Password</button>
          </div>
        </form>
      </div>
    );
};

export default Settings;