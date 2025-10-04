import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useAuthContext from "../../../hooks/useAuthContext";
import { TbCurrencyTaka } from "react-icons/tb";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

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

  if (authLoading || loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <span className="loading loading-spinner w-40 h-40 text-white"></span>
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

  return (
    <div className="min-h-screen p-6">
      {/* Helmet for SEO */}
      <Helmet>
        <title>My Transaction History - Mahad</title>
        <meta
          name="description"
          content="View all your payments, enrolled courses, and transaction history in Mahad dashboard."
        />
      </Helmet>

      <h1 className="text-3xl font-bold text-primary mb-8">
        My Transaction History
      </h1>

      <div className="bg-white rounded-lg">
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
