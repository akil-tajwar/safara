import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';

const TransactionPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const transactionsPerPage = 15;

  // Mock data for transactions
  const transactions = [
    { id: 1, studentName: "John Doe", courseName: "Advanced React Patterns", transactionId: "TRX123456", enrollTime: "14:30", enrollDate: "2023-05-15", amount: "$99.99", status: "Completed" },
    { id: 2, studentName: "Jane Smith", courseName: "Machine Learning Fundamentals", transactionId: "TRX789012", enrollTime: "09:45", enrollDate: "2023-05-14", amount: "$149.99", status: "Completed" },
    { id: 3, studentName: "Bob Johnson", courseName: "Digital Marketing Strategies", transactionId: "TRX345678", enrollTime: "16:20", enrollDate: "2023-05-13", amount: "$79.99", status: "Pending" },
    { id: 4, studentName: "Alice Brown", courseName: "UX/UI Design Principles", transactionId: "TRX901234", enrollTime: "11:10", enrollDate: "2023-05-12", amount: "$129.99", status: "Completed" },
    { id: 5, studentName: "Charlie Davis", courseName: "Python for Data Science", transactionId: "TRX567890", enrollTime: "13:55", enrollDate: "2023-05-11", amount: "$199.99", status: "Completed" },
    { id: 5, studentName: "Charlie Davis", courseName: "Python for Data Science", transactionId: "TRX567890", enrollTime: "13:55", enrollDate: "2023-05-11", amount: "$199.99", status: "Completed" },
    { id: 5, studentName: "Charlie Davis", courseName: "Python for Data Science", transactionId: "TRX567890", enrollTime: "13:55", enrollDate: "2023-05-11", amount: "$199.99", status: "Completed" },
    { id: 5, studentName: "Charlie Davis", courseName: "Python for Data Science", transactionId: "TRX567890", enrollTime: "13:55", enrollDate: "2023-05-11", amount: "$199.99", status: "Completed" },
    { id: 5, studentName: "Charlie Davis", courseName: "Python for Data Science", transactionId: "TRX567890", enrollTime: "13:55", enrollDate: "2023-05-11", amount: "$199.99", status: "Completed" },
    { id: 5, studentName: "Charlie Davis", courseName: "Python for Data Science", transactionId: "TRX567890", enrollTime: "13:55", enrollDate: "2023-05-11", amount: "$199.99", status: "Completed" },
    { id: 5, studentName: "Charlie Davis", courseName: "Python for Data Science", transactionId: "TRX567890", enrollTime: "13:55", enrollDate: "2023-05-11", amount: "$199.99", status: "Completed" },
    { id: 5, studentName: "Charlie Davis", courseName: "Python for Data Science", transactionId: "TRX567890", enrollTime: "13:55", enrollDate: "2023-05-11", amount: "$199.99", status: "Completed" },
    { id: 5, studentName: "Charlie Davis", courseName: "Python for Data Science", transactionId: "TRX567890", enrollTime: "13:55", enrollDate: "2023-05-11", amount: "$199.99", status: "Completed" },
    { id: 5, studentName: "Charlie Davis", courseName: "Python for Data Science", transactionId: "TRX567890", enrollTime: "13:55", enrollDate: "2023-05-11", amount: "$199.99", status: "Completed" },
    { id: 5, studentName: "Charlie Davis", courseName: "Python for Data Science", transactionId: "TRX567890", enrollTime: "13:55", enrollDate: "2023-05-11", amount: "$199.99", status: "Completed" },
    { id: 5, studentName: "Charlie Davis", courseName: "Python for Data Science", transactionId: "TRX567890", enrollTime: "13:55", enrollDate: "2023-05-11", amount: "$199.99", status: "Completed" },
    // Add more mock data as needed
  ];

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction =>
    transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-[#125ca6] mb-8">Transaction History</h1>
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
                <th className="col-span-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction, index) => (
                <tr key={transaction.id} className="grid grid-cols-12">
                  <td className="col-span-1">{indexOfFirstTransaction + index + 1}</td>
                  <td className="col-span-2">{transaction.studentName}</td>
                  <td className="col-span-3">{transaction.courseName}</td>
                  <td className="col-span-2">{transaction.transactionId}</td>
                  <td className="col-span-1">{transaction.enrollTime}</td>
                  <td className="col-span-1">{transaction.enrollDate}</td>
                  <td className="col-span-1 text-right">{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <nav>
          <ul className="pagination flex items-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`text-2xl py-2 px-4 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#125ca6]'}`}
            >
              <FaChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button
                  className={`page-link py-2 px-4 rounded ${currentPage === index + 1 ? 'bg-[#125ca6] text-white' : 'text-[#125ca6]'
                    }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`text-2xl py-2 px-4 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#125ca6]'}`}
            >
              <FaChevronRight />
            </button>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TransactionPage;