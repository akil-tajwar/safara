import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import AllCourses from "../../../Components/AllCourses";
const MyClasses = () => {
  const categories = ["My Classes", "Explore", "Incoming","Course Details"];
  const { category } = useParams();

  const initialIndex = categories.indexOf(category);

  const [tabIndex, setTabIndex] = useState(initialIndex+1);


  return (
    <>
      <Tabs defaultIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          <Tab selectedClassName="bg-[#125ca6] text-white  rounded">My Classes</Tab>
          <Tab selectedClassName="bg-[#125ca6] text-white  rounded">Explore</Tab>
          <Tab selectedClassName="bg-[#125ca6] text-white  rounded">
        Incoming
          </Tab>
          <Tab selectedClassName="bg-[#125ca6] text-white  rounded">Course Details</Tab>
        </TabList>
        <TabPanel><div className="card md:w-96 my-10 bg-slate-300 rounded-xl shadow-xl border  border-blue-400 ">
        <figure className="px-10 pt-10 ">
          <img className="rounded-xl" src={"pic"} />
        </figure>
        <div className="card-body">
          <p className="text-2xl text-[#125ca6]">
            Your running course is <br />
            <span className=" text-4xl">student </span>
          </p>
          <div className="card-actions justify-end"></div>
        </div>
      </div></TabPanel>
        <TabPanel><AllCourses></AllCourses></TabPanel>
        <TabPanel>Upcoming</TabPanel>
        <TabPanel>My courses details</TabPanel>
      </Tabs>

      
    </>
  );
};

export default MyClasses;
