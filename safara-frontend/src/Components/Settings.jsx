
const Settings = () => {
  return (
    // <div className="card bg-base-100 w-full max-w-md mx-auto shrink-0 shadow-2xl">
    //   <form className="card-body">
    //     <div className="form-control">
    //       <label className="label">
    //         <span className="label-text">Old Password</span>
    //       </label>
    //       <input type="password" placeholder="Old Password" className="input input-bordered" required />
    //     </div>
    //     <div className="form-control">
    //       <label className="label">
    //         <span className="label-text">New Password</span>
    //       </label>
    //       <input type="password" placeholder="New Password" className="input input-bordered" required />

    //     </div>
    //     <div className="form-control">
    //       <label className="label">
    //         <span className="label-text">Re-Enter New Password</span>
    //       </label>
    //       <input type="password" placeholder="Re-Enter New Password" className="input input-bordered" required />

    //     </div>
    //     <div className="form-control mt-6">
    //       <button className="btn bg-[#125ca6] text-white font-semibold">Change Password</button>
    //     </div>
    //   </form>
    // </div>
    <div className="w-3/4 mx-auto">
      <div>
        <h3 className="text-2xl pb-2">Security</h3>
        <div className="border p-4 rounded-lg flex justify-between items-center">
          <h5 className="text-lg">Password</h5>
          <button className="bg-[#125ca6] py-2 px-5 w-44 rounded-md text-white" onClick={() => document.getElementById('change-passwrod-modal').showModal()}>Change Password</button>
          <dialog id="change-passwrod-modal" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <h3 className="font-semibold text-xl pb-3">Change Password</h3>
              <form action="">
                <div className="form-control">
                  <label className="">
                    <span className="">Old Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your old password"
                    className="input input-bordered focus:border-none rounded-md border hover:border-[#125ca6]"
                  />
                </div>
                <div className="form-control py-3">
                  <label className="">
                    <span className="">New Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    className="input input-bordered focus:border-none rounded-md border hover:border-[#125ca6]"
                  />
                </div>
                <div className="form-control">
                  <label className="">
                    <span className="">Retype new Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    className="input input-bordered focus:border-none rounded-md border hover:border-[#125ca6]"
                  />
                </div>
                <button type="submit" className="bg-[#125ca6] w-full mt-6 py-3 rounded-md text-white">
                  Change Password
                </button>
              </form>
            </div>
          </dialog>
        </div>
      </div>
      <div className="pt-5">
        <h3 className="text-2xl pb-2">Danger Zone</h3>
        <div className="border border-error p-4 rounded-lg flex justify-between items-center">
          <h5 className="text-lg">Delete your account permanently</h5>
          <button className="text-white bg-error py-2 w-44 px-5 rounded-md" onClick={() => document.getElementById('delete-account').showModal()}>Delete Account</button>
          <dialog id="delete-account" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <h3 className="font-semibold text-lg pb-3">Delete your account</h3>
              <div className="form-control">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered focus:border-none rounded-md border hover:border-[#125ca6]"
                />
              </div>
              <button type="submit" className="text-white bg-error w-full mt-6 py-3 rounded-md">
                  Delete Account
                </button>
              <p className="pt-4 text-error text-center font-semibold">NB: You will loose all of your coruses and certificates</p>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default Settings;