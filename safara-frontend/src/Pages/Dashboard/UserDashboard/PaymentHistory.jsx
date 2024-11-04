
const PaymentHistory = () => {
 

    return (
        <div>
        <h2 className="text-4xl font-bold text-[#125ca6]">Your Payment History</h2>
  
        <div className="overflow-x-auto">
    <table className="table table-zebra">
      {/* head */}
      <thead>
        <tr>
          <th>Status</th>
          <th>TransactionId</th>
          <th>Total Price</th>
          <th>Payment Date</th>
        </tr>
      </thead>
      <tbody>
    
       
      </tbody>
    </table>
  </div>
      </div>
    );
};

export default PaymentHistory;