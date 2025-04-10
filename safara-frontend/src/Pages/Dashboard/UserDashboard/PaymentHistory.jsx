import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import useAuthContext from "../../../hooks/useAuthContext";
import { TbCurrencyTaka } from "react-icons/tb";
import { useEffect, useState } from "react";

const PaymentHistory = () => {
  const { user, loading: authLoading } = useAuthContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const transactionsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user) return;

      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_SAFARA_baseUrl;
        // Fetch all data in parallel
        const [transactionsRes, coursesRes] = await Promise.all([
          fetch(`${baseUrl}/api/course/getAllTransactions`),
          fetch(`${baseUrl}/api/course/getAllCourses`),
        ]);

        const [transactionsData, coursesData] = await Promise.all([
          transactionsRes.json(),
          coursesRes.json(),
        ]);

        // Create lookup objects for courses
        const coursesMap = coursesData.reduce((acc, course) => {
          acc[course._id] = course.title;
          return acc;
        }, {});

        setCourses(coursesMap);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  // Filter transactions based on search term and user ID
  const filteredTransactions = transactions.filter((transaction) => {
    if (!user || !user.user || !user.user._id) return false;

    const courseName = courses[transaction.courseId] || "";
    const searchTermLower = searchTerm.toLowerCase();

    return (
      transaction.studentsId === user.user._id &&
      (courseName.toLowerCase().includes(searchTermLower) ||
        transaction._id.toLowerCase().includes(searchTermLower))
    );
  });

  useEffect(() => {
    console.log("Filtered Transactions:", filteredTransactions.length);
    console.log("User ID:", user?.user?._id);
  }, [filteredTransactions, user]);

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  console.log(
    "🚀 ~ PaymentHistory ~ currentTransactions:",
    currentTransactions.length
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-primary">Loading...</div>
      </div>
    );
  }

  if (!user || !user.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-primary">
          Please log in to view your transaction history
        </div>
      </div>
    );
  }

  if (filteredTransactions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-primary">You have no transactions yet</div>
      </div>
    );
  }

  console.log("Rendering transactions:", currentTransactions.length);
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-primary mb-8">
        My Transaction History
      </h1>
      <div className="bg-white rounded-lg">
        {/* <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div> */}

        <div className="overflow-x-auto border rounded-md">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="grid grid-cols-11 bg-gray-50">
                <th className="col-span-1">Sl. No.</th>
                <th className="col-span-4">Course Name</th>
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
                  <tr key={transaction._id} className="grid grid-cols-11">
                    <td className="col-span-1">
                      {indexOfFirstTransaction + index + 1}
                    </td>
                    <td className="col-span-4">
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
                  : "text-primary"
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
                      ? "bg-primary text-white"
                      : "text-primary"
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
                  : "text-primary"
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

export default PaymentHistory;
