import useAuthContext from "../hooks/useAuthContext";
import { MdEdit, MdPerson } from "react-icons/md";
import { FaMedal } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
    const { user } = useAuthContext();
    const [activeTab, setActiveTab] = useState(0);
    const [userData, setUserData] = useState(null); // Start with null to avoid rendering issues before data is fetched

    const fetchSingleUser = () => {
        const url = `http://localhost:4000/api/user/singleUser/${user?.user?._id}`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setUserData(data);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        if (user?.user?._id) { // Only fetch data if the user ID exists
            fetchSingleUser();
        }
    }, [user?.user?._id]);

    // If userData is still null, show a loading state or message
    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-3/4 mx-auto">
            <div className="grid grid-cols-7 gap-8">
                <div className="col-span-2">
                    <img className="h-[400px] rounded-md w-full object-cover object-top" src={userData.img} alt="" />
                    <div className="py-5">
                        <p className="font-semibold text-xs text-slate-400 pb-1">PROFESSIONAL INFO</p>
                        <div className="">
                            <p>{userData.institution}</p>
                            <p>{userData.profession[0]?.position}</p>
                        </div>
                    </div>
                    <div className="py-5">
                        <p className="font-semibold text-xs text-slate-400 pb-1">EDUCATIONAL HISTORY</p>
                        <div className="">
                            <p>{userData.degree}</p>
                            <p>{userData.result}</p>
                        </div>
                    </div>
                </div>
                <div className="col-span-5">
                    <div className="border-b pb-1">
                        <div className="flex justify-between items-center">
                            <h3 className="text-3xl font-semibold">{userData.firstname} {userData.lastname}</h3>
                            <Link to={'/updateProfile'}><MdEdit className="text-3xl bg-[#125ca6] text-white rounded-full p-1" /></Link>
                        </div>
                        <p className="text-xl">{userData.profession[0]?.position}</p>
                        <div className="pt-7 flex gap-8">
                            <p className={`flex gap-1 items-center cursor-pointer ${activeTab === 0 && 'text-[#125ca6]'}`} onClick={() => setActiveTab(0)}><MdPerson className="text-xl" /> <span>About</span></p>
                            <p className={`flex gap-1 items-center cursor-pointer ${activeTab === 1 && 'text-[#125ca6]'}`} onClick={() => setActiveTab(1)}><FaMedal /> <span>Certificates</span></p>
                        </div>
                    </div>
                    {activeTab === 0 && (
                        <div>
                            <div className="py-5 mt-5">
                                <p className="font-semibold text-slate-400 pb-2 text-xs">CONTACT INFO</p>
                                <div className="grid grid-cols-5">
                                    <p>Phone</p>
                                    <p className="col-span-4">{userData.phone}</p>
                                </div>
                                <div className="grid grid-cols-5 py-2">
                                    <p>Address</p>
                                    <p className="col-span-4">{userData.location}</p>
                                </div>
                                <div className="grid grid-cols-5">
                                    <p>Email</p>
                                    <p className="col-span-4">{userData.email}</p>
                                </div>
                            </div>
                            <div className="py-5">
                                <p className="font-semibold text-slate-400 pb-2 text-xs">PERSONAL INFO</p>
                                <div className="grid grid-cols-5">
                                    <p>Birthday</p>
                                    <p className="col-span-4">{userData.birthday}</p>
                                </div>
                                <div className="grid grid-cols-5 py-2">
                                    <p>Gender</p>
                                    <p className="col-span-4">{userData.gender}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 1 && (
                        <div className="">
                            <h4 className="text-xl flex justify-center items-center pt-32">This user did not achieve any certificate yet</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;