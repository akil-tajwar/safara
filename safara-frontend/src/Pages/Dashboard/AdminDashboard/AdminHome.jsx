import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { FaUsers } from "react-icons/fa6";
import { SiCoursera } from "react-icons/si";
import { IoIosNotifications } from "react-icons/io";
import React, { PureComponent, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { curveCardinal } from "d3-shape";
import useAuthContext from "../../../hooks/useAuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const cardinal = curveCardinal.tension(0.2);

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const data02 = [
  { name: "A1", value: 100 },
  { name: "A2", value: 300 },
  { name: "B1", value: 100 },
  { name: "B2", value: 80 },
  { name: "B3", value: 40 },
  { name: "B4", value: 30 },
  { name: "B5", value: 50 },
  { name: "C1", value: 100 },
  { name: "C2", value: 200 },
  { name: "D1", value: 150 },
  { name: "D2", value: 50 },
];

const AdminHome = () => {
  const { user } = useAuthContext();

  const [courseCount, setCourseCount] = useState();
  const [usersCount, setUsersCount] = useState();

  // count courses

  const axiosSecure = useAxiosSecure();

  axiosSecure
    .get("/api/course/getCourseCount")
    .then((res) => setCourseCount(res.data.courseCount));

  // users count

  axiosSecure.get('/api/user/allUsersCount')
  .then(res=> setUsersCount(res.data.usersCount) )
  return (
    <div>
     

      <div className="stats shadow gap-x-32 ml-40 mt-5">
        <div className="stat mr-10">
          <div className="stat-figure text-secondary">
            <FaUsers className="text-3xl" />
          </div>
          <div className="stat-title">Users</div>
          <div className="stat-value">{usersCount}</div>
          <div className="stat-desc">Jan 1st - Feb 1st</div>
        </div>

        <div className="stat mr-10">
          <div className="stat-figure text-secondary">
            <SiCoursera className="text-3xl" />
          </div>
          <div className="stat-title">All Courses</div>
          <div className="stat-value">{courseCount}</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>

        <div className="stat mr-10">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Enrolled Users</div>
          <div className="stat-value">1,200</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
      <div className="flex mt-24">
        <PieChart width={400} height={400}>
          <Pie
            data={data01}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#8884d8"
          />
          <Pie
            data={data02}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            fill="#82ca9d"
            label
          />
        </PieChart>

        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
          />
          <Area
            type={cardinal}
            dataKey="uv"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.3}
          />
        </AreaChart>
      </div>
    </div>
  );
};

export default AdminHome;
