import useAuthContext from "../hooks/useAuthContext";
import { MdEdit, MdPerson } from "react-icons/md";
import { FaMedal } from "react-icons/fa";
import { useState } from "react";

const Profile = () => {
    const { user } = useAuthContext();
    const [activeTab, setActiveTab] = useState(0);
    return (
        <div className="w-3/4 mx-auto">
            <div className="grid grid-cols-6 gap-8">
                <div className="col-span-2">
                    <img className="h-[450px] rounded-md w-full object-cover object-top" src={user?.user?.img} alt="" />
                    <div className="py-5">
                        <p className="font-semibold text-xs text-slate-400 pb-1">Profession</p>
                        <div className="">
                            <p>International Islamic University Chittagong</p>
                            <p>Student</p>
                        </div>
                    </div>
                    <div className="py-5">
                        <p className="font-semibold text-xs text-slate-400 pb-1">Educational History</p>
                        <div className="">
                            <p>BSC (CSE), MBA</p>
                            <p>Student</p>
                        </div>
                    </div>
                </div>
                <div className="col-span-4">
                    <div className="border-b pb-1">
                        <div className="flex justify-between items-center">
                            <h3 className="text-3xl font-semibold">{user?.user?.firstname} {user?.user?.lastname}</h3>
                            <MdEdit className="text-3xl bg-[#125ca6] text-white rounded-full p-1" />
                        </div>
                        <p className="text-xl">Student</p>
                        <div className="pt-7 flex gap-8">
                            <p className={`flex gap-1 items-center cursor-pointer ${activeTab == 0 && 'text-[#125ca6]'}`} onClick={() => setActiveTab(0)}><MdPerson className="text-xl" /> <span>About</span></p>
                            <p className={`flex gap-1 items-center cursor-pointer ${activeTab == 1 && 'text-[#125ca6]'}`} onClick={() => setActiveTab(1)}><FaMedal /> <span>Certificates</span></p>
                        </div>
                    </div>
                    {activeTab == 0 &&
                        <div>
                            <div className="py-5 mt-5">
                                <p className="font-semibold text-slate-400 pb-2 text-xs">Contact Info</p>
                                <div className="grid grid-cols-5">
                                    <p>Phone</p>
                                    <p className="col-span-4">0123456789</p>
                                </div>
                                <div className="grid grid-cols-5 py-2">
                                    <p>Address</p>
                                    <p className="col-span-4">Anderkillah, Chittagong, Bangladesh</p>
                                </div>
                                <div className="grid grid-cols-5">
                                    <p>Email</p>
                                    <p className="col-span-4">akiltajwar@gmail.com</p>
                                </div>
                            </div>
                            <div className="py-5">
                                <p className="font-semibold text-slate-400 pb-2 text-xs">Personal Info</p>
                                <div className="grid grid-cols-5">
                                    <p>Birthday</p>
                                    <p className="col-span-4">29 July 1998</p>
                                </div>
                                <div className="grid grid-cols-5 py-2">
                                    <p>Gender</p>
                                    <p className="col-span-4">Male</p>
                                </div>
                            </div>
                        </div>
                    }
                    {activeTab == 1 &&
                        <div className="">
                            <h4 className="text-xl flex justify-center items-center pt-32">User did not achieve any certificate yet</h4>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Profile;