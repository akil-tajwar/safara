import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";

const AllTransactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState({});
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const transactionsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [transactionsRes, usersRes, coursesRes] = await Promise.all([
          fetch("http://localhost:4000/api/course/getAllTransactions"),
          fetch("http://localhost:4000/api/user/allUsers"),
          fetch("http://localhost:4000/api/course/getAllCourses"),
        ]);

        const [transactionsData, usersData, coursesData] = await Promise.all([
          transactionsRes.json(),
          usersRes.json(),
          coursesRes.json(),
        ]);

        // Create lookup objects for users and courses
        const usersMap = usersData.reduce((acc, user) => {
          acc[user._id] = `${user.firstname} ${user.lastname}`;
          return acc;
        }, {});

        const coursesMap = coursesData.reduce((acc, course) => {
          acc[course._id] = course.title;
          return acc;
        }, {});

        setUsers(usersMap);
        setCourses(coursesMap);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction) => {
    const studentName = users[transaction.studentsId] || "";
    const courseName = courses[transaction.courseId] || "";
    const searchTermLower = searchTerm.toLowerCase();

    return (
      studentName.toLowerCase().includes(searchTermLower) ||
      courseName.toLowerCase().includes(searchTermLower) ||
      transaction._id.toLowerCase().includes(searchTermLower)
    );
  });

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-[#125ca6]">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-[#125ca6] mb-8">
        Transaction History
      </h1>
      <div className="bg-white rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#125ca6]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto border rounded-md">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="grid grid-cols-12 bg-gray-50">
                <th className="col-span-1">Sl. No.</th>
                <th className="col-span-2">Student Name</th>
                <th className="col-span-3">Course Name</th>
                <th className="col-span-2">Transaction ID</th>
                <th className="col-span-1">Time</th>
                <th className="col-span-1">Date</th>
                <th className="col-span-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction, index) => {
                const dateObj = new Date(transaction.createdAt);
                return (
                  <tr key={transaction._id} className="grid grid-cols-12">
                    <td className="col-span-1">
                      {indexOfFirstTransaction + index + 1}
                    </td>
                    <td className="col-span-2">
                      {users[transaction.studentsId] || "Unknown User"}
                    </td>
                    <td className="col-span-3">
                      {courses[transaction.courseId] || "Unknown Course"}
                    </td>
                    <td className="col-span-2">{transaction._id}</td>
                    <td className="col-span-1">
                      {dateObj.toLocaleTimeString()}
                    </td>
                    <td className="col-span-1">
                      {dateObj.toLocaleDateString()}
                    </td>
                    <td className="col-span-2 text-right flex items-center justify-end">
                      <p>{transaction.payment}</p>
                      <TbCurrencyTaka />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <nav>
          <ul className="pagination flex items-center gap-3">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className={`text-2xl py-2 px-4 rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#125ca6]"
              }`}
            >
              <FaChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index + 1}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className={`page-link py-2 px-4 rounded ${
                    currentPage === index + 1
                      ? "bg-[#125ca6] text-white"
                      : "text-[#125ca6]"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className={`text-2xl py-2 px-4 rounded ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#125ca6]"
              }`}
            >
              <FaChevronRight />
            </button>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AllTransactions;
