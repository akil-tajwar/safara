import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
const MyClasses = () => {
  const categories = ["My Classes", "Explore", "Incoming","Course Details"];
  const { category } = useParams();

  const initialIndex = categories.indexOf(category);

  const [tabIndex, setTabIndex] = useState(initialIndex);


  return (
    <>
      <Tabs defaultIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          <Tab selectedClassName="bg-orange-500 text-black rounded">My Classes</Tab>
          <Tab selectedClassName="bg-orange-500 text-black rounded">Explore</Tab>
          <Tab selectedClassName="bg-orange-500 text-black rounded">
        Incoming
          </Tab>
          <Tab selectedClassName="bg-orange-500 text-black rounded">Course Details</Tab>
        </TabList>
        <TabPanel>unlocked courses</TabPanel>
        <TabPanel>All Courses</TabPanel>
        <TabPanel>Upcoming</TabPanel>
        <TabPanel>My courses details</TabPanel>
      </Tabs>

      <div className="card md:w-96 my-10 bg-slate-300 rounded-xl shadow-xl border  border-blue-400 ">
        <figure className="px-10 pt-10 ">
          <img className="rounded-xl" src={"pic"} />
        </figure>
        <div className="card-body">
          <p className="text-2xl text-[#125ca6]">
            Your running course is <br />
            <span className="text-orange-500 text-4xl">student </span>
          </p>
          <div className="card-actions justify-end"></div>
        </div>
      </div>
    </>
  );
};

export default MyClasses;
